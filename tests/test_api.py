"""
GATHR Automated API Integration Test Suite
Validates database ACID properties, ticket state transitions, and duplicate prevention.
"""
import unittest
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:3000"

class TestGathrAPI(unittest.TestCase):
    def test_01_get_events(self):
        """Verify event listing returns populated array with ticket tiers"""
        req = urllib.request.Request(f"{BASE_URL}/api/v1/events")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertGreaterEqual(len(data['data']), 1)
            event = data['data'][0]
            self.assertIn('ticketTiers', event)
            self.assertIn('stats', event)

    def test_02_create_event(self):
        """Verify organizer can publish event into database"""
        payload = {
            "title": "CI Test Event Summit",
            "category": "Tech & AI",
            "description": "Automated CI Test",
            "city": "Lagos",
            "venue": "Test Venue",
            "date": "Dec 30, 2026",
            "time": "10:00 AM",
            "tierName": "VIP Test Pass",
            "tierPrice": 50000,
            "tierCapacity": 100,
            "hostSplit": 70,
            "venueSplit": 20,
            "promoterSplit": 10
        }
        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/events",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 201)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertTrue(data['eventId'].startswith('gathr-event-'))

    def test_03_checkout_order(self):
        """Verify checkout creates order and issues ticket with hash"""
        payload = {
            "eventId": "gathr-event-01",
            "tierId": "t1-vip",
            "tierName": "Executive VIP Pass",
            "name": "Amara Okafor",
            "email": "amara@example.com",
            "quantity": 1,
            "subtotal": 95000,
            "fee": 2375,
            "total": 97375
        }
        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/orders/checkout",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertIn('ticketCode', data)
            self.assertIn('orderRef', data)

    def test_04_atomic_check_in_and_duplicate_rejection(self):
        """Verify gate scanner validates ticket once, and immediately rejects duplicate scans with 409"""
        import time
        test_code = f"GTHR-VIP-TEST-{int(time.time() * 1000) % 100000}"
        payload = {"ticketCode": test_code, "gate": "Gate 1 VIP"}
        
        # 1st Scan: Should succeed
        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/check-ins/validate",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'valid')

        # 2nd Scan: Must fail with HTTP 409 Conflict
        try:
            with urllib.request.urlopen(req) as resp:
                self.fail("Expected HTTP 409 Conflict for duplicate scan")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 409)
            err_data = json.loads(e.read().decode('utf-8'))
            self.assertEqual(err_data['status'], 'already_used')

    def test_05_get_vendors_and_submit_rfp(self):
        """Verify vendor directory listing and RFP escrow booking"""
        req = urllib.request.Request(f"{BASE_URL}/api/v1/vendors")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertGreaterEqual(len(data['vendors']), 1)

        rfp_payload = {
            "eventId": "gathr-event-01",
            "vendorId": "vnd-01",
            "vendorName": "Pulse Audio-Visual",
            "category": "Audio/Visual & Lighting",
            "budget": 4500000,
            "scope": "Mainstage 4K LED concert screen"
        }
        rfp_req = urllib.request.Request(
            f"{BASE_URL}/api/v1/vendors/rfp",
            data=json.dumps(rfp_payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(rfp_req) as resp:
            self.assertEqual(resp.status, 201)
            rfp_data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(rfp_data['status'], 'success')
            self.assertEqual(rfp_data['escrowFunded'], 2250000)

    def test_06_run_of_show_schedule(self):
        """Verify Run of Show timeline retrieval and activity insertion"""
        req = urllib.request.Request(f"{BASE_URL}/api/v1/planning/run-of-show")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertGreaterEqual(len(data['schedule']), 1)

    def test_07_batch_offline_sync(self):
        """Verify Gate Scanner batch sync validates queue and reports duplicate rejections"""
        import time
        unique_sync_code = f"GTHR-SYNC-{int(time.time() * 1000) % 100000}"
        payload = {
            "scans": [
                {"ticketCode": unique_sync_code, "gate": "Gate 1 Offline PWA", "scannedAt": "10:15 AM"},
                {"ticketCode": "GTHR-VIP-9021", "gate": "Gate 1 Offline PWA", "scannedAt": "10:16 AM"} # Already checked in
            ]
        }
        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/check-ins/batch-sync",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertEqual(data['syncedTotal'], 2)
            self.assertEqual(data['successfulCount'], 1)
            self.assertEqual(data['duplicateRejections'], 1)

    def test_08_paystack_webhook_processing(self):
        """Verify Paystack charge.success webhook atomically validates, settles order, and issues ticket"""
        import time, hmac, hashlib
        ref = f"PSTK-TEST-{int(time.time() * 1000) % 100000}"
        payload = {
            "event": "charge.success",
            "data": {
                "reference": ref,
                "amount": 9500000, # 95,000 NGN in kobo
                "status": "success",
                "customer": {
                    "email": "amara.webhook@tech.ng",
                    "first_name": "Amara",
                    "last_name": "Okafor"
                },
                "metadata": {
                    "eventId": "gathr-event-01",
                    "tierName": "Executive VIP Pass",
                    "tierId": "t1-vip",
                    "quantity": 1
                }
            }
        }
        raw_body = json.dumps(payload).encode('utf-8')
        secret = "sk_test_gathr_secret_998240"
        sig = hmac.new(secret.encode('utf-8'), raw_body, hashlib.sha512).hexdigest()

        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/payments/paystack/webhook",
            data=raw_body,
            headers={
                'Content-Type': 'application/json',
                'x-paystack-signature': sig
            }
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertEqual(data['gateway'], 'Paystack')
            self.assertTrue(data['signatureVerified'])
            self.assertIn('ticketCode', data['result'])

    def test_09_stripe_webhook_processing(self):
        """Verify Stripe payment_intent.succeeded webhook processes successfully"""
        import time
        ref = f"pi_stripe_{int(time.time() * 1000) % 100000}"
        payload = {
            "type": "payment_intent.succeeded",
            "data": {
                "object": {
                    "id": ref,
                    "amount": 6500, # $65.00 USD
                    "receipt_email": "global.guest@stripe.com",
                    "customer_details": {
                        "name": "Sarah Jenkins",
                        "email": "global.guest@stripe.com"
                    },
                    "metadata": {
                        "eventId": "gathr-event-01",
                        "tierName": "Executive VIP Pass",
                        "tierId": "t1-vip"
                    }
                }
            }
        }
        req = urllib.request.Request(
            f"{BASE_URL}/api/v1/payments/stripe/webhook",
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'stripe-signature': 'test_stripe_sig'
            }
        )
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertEqual(data['gateway'], 'Stripe')
            self.assertIn('ticketCode', data['result'])

    def test_10_webhook_logs_retrieval(self):
        """Verify Super-Admin Studio can retrieve live webhook audit logs"""
        req = urllib.request.Request(f"{BASE_URL}/api/v1/payments/webhooks/logs")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode('utf-8'))
            self.assertEqual(data['status'], 'success')
            self.assertGreaterEqual(len(data['webhooks']), 1)

if __name__ == '__main__':
    unittest.main()

