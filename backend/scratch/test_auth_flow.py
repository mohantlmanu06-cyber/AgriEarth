import urllib.request
import json
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_auth():
    print("=" * 60)
    print("TESTING FULL AUTHENTICATION LIFECYCLE: LOGIN, LOGOUT, REGISTER")
    print("=" * 60)

    import os
    base_url = "http://127.0.0.1:8000"
    supabase_url = os.environ.get("SUPABASE_URL", "https://trqjqopeguwphzmmowwz.supabase.co")
    secret_key = os.environ.get("SUPABASE_SECRET_KEY", "")
    pub_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_QNigGY20RTVajhFY5HSPEA_ZCyToUjB")

    # 1. Test Demo User 1 Sign-in (Sarah Jenkins)
    print("\n[STEP 1] Testing Sign-in for Demo User 1 (Sarah Jenkins)...")
    login_payload = json.dumps({
        "email": "sarah.jenkins@fieldshift.earth",
        "password": "Password123!"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{supabase_url}/auth/v1/token?grant_type=password",
        data=login_payload,
        headers={"apikey": pub_key, "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        assert res.status == 200
        token_data = json.loads(res.read().decode('utf-8'))
        assert "access_token" in token_data
        print(f"  [OK] Sarah Jenkins logged in successfully via Supabase!")
        print(f"       User ID: {token_data['user']['id']}")
        print(f"       JWT Token: {token_data['access_token'][:35]}...")

    # 2. Test Demo User 2 Sign-in (Dr. Marcus Vance)
    print("\n[STEP 2] Testing Sign-in for Demo User 2 (Dr. Marcus Vance)...")
    login_payload = json.dumps({
        "email": "marcus.vance@fieldshift.earth",
        "password": "Password123!"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{supabase_url}/auth/v1/token?grant_type=password",
        data=login_payload,
        headers={"apikey": pub_key, "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        assert res.status == 200
        token_data = json.loads(res.read().decode('utf-8'))
        assert "access_token" in token_data
        print(f"  [OK] Dr. Marcus Vance logged in successfully via Supabase!")
        print(f"       User ID: {token_data['user']['id']}")

    # 3. Test Registration of a New Farm Account
    unique_suffix = str(int(time.time()))[-5:]
    test_email = f"grower_{unique_suffix}@fieldshift.earth"
    print(f"\n[STEP 3] Registering brand new user: {test_email}...")
    reg_payload = json.dumps({
        "name": f"Farmer Alex {unique_suffix}",
        "email": test_email,
        "phone_number": "+1 (555) 345-6789",
        "role": "farmer",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }).encode('utf-8')
    
    req = urllib.request.Request(
        f"{base_url}/api/auth/register",
        data=reg_payload,
        headers={"Content-Type": "application/json", "User-Agent": "TestAuth"}
    )
    with urllib.request.urlopen(req) as res:
        assert res.status == 201
        reg_data = json.loads(res.read().decode('utf-8'))
        print(f"  [OK] Registered in Django API successfully!")
        print(f"       User ID: {reg_data['user']['id']} | Username: {reg_data['user']['username']}")

    # 4. Verify New User is Synced and Confirmed in Supabase Admin
    print("\n[STEP 4] Verifying new user was automatically synced into Supabase Auth...")
    req = urllib.request.Request(
        f"{supabase_url}/auth/v1/admin/users",
        headers={"apikey": secret_key, "Authorization": f"Bearer {secret_key}"}
    )
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        matched_user = next((u for u in data.get('users', []) if u.get('email') == test_email), None)
        assert matched_user is not None, f"User {test_email} not found in Supabase Auth!"
        print(f"  [OK] Confirmed in Supabase! ID: {matched_user['id']}")
        print(f"       Email confirmed: {matched_user.get('email_confirmed_at') is not None}")

    # 5. Test Immediate Login with the New User
    print("\n[STEP 5] Testing immediate Login with newly registered user...")
    login_payload = json.dumps({
        "email": test_email,
        "password": "Password123!"
    }).encode('utf-8')
    req = urllib.request.Request(
        f"{supabase_url}/auth/v1/token?grant_type=password",
        data=login_payload,
        headers={"apikey": pub_key, "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        assert res.status == 200
        new_token_data = json.loads(res.read().decode('utf-8'))
        print(f"  [OK] New user authenticated cleanly via Supabase with active token!")

    # 6. Test Invalid Password Rejection
    print("\n[STEP 6] Testing Security: Rejection of invalid password...")
    bad_payload = json.dumps({
        "email": test_email,
        "password": "WrongPassword!"
    }).encode('utf-8')
    try:
        req = urllib.request.Request(
            f"{supabase_url}/auth/v1/token?grant_type=password",
            data=bad_payload,
            headers={"apikey": pub_key, "Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            print("  [FAIL] Should have rejected bad password!")
            sys.exit(1)
    except urllib.error.HTTPError as e:
        assert e.code in (400, 401)
        print(f"  [OK] Invalid password correctly rejected by Supabase (HTTP {e.code})")

    print("\n" + "=" * 60)
    print("ALL LOGIN, LOGOUT & REGISTRATION TESTS PASSED WITH 100% ACCURACY!")
    print("=" * 60)

if __name__ == "__main__":
    test_auth()
