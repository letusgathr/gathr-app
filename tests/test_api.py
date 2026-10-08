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
        test_code = "GTHR-VIP-9999"
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

if __name__ == '__main__':
    unittest.main()
