import os
import sys
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.mailer import send_reset_password_email

def test_mail():
    load_dotenv()
    target_email = os.getenv("EMAILS_FROM_EMAIL") # Test sending to yourself
    if not target_email or "your-email" in target_email:
        print("[ERROR] Please update SMTP_USER and EMAILS_FROM_EMAIL in your .env first!")
        return

    print(f"--- SMTP Diagnostic Test ---")
    print(f"Target Email: {target_email}")
    print(f"SMTP User: {os.getenv('SMTP_USER')}")
    print(f"SMTP Host: {os.getenv('SMTP_HOST')}:{os.getenv('SMTP_PORT')}")
    print(f"Attempting to send test email...")
    
    success = send_reset_password_email(target_email, "TEST_TOKEN_123")
    
    if success:
        print("\n[SUCCESS] The server reported that the email was sent!")
        print("1. Check your SPAM/Junk folder.")
        print("2. Ensure EMAILS_FROM_EMAIL matches SMTP_USER for Gmail.")
    else:
        print("\n[FAILED] The email could not be sent. Check the error message above.")
    print("--- End Test ---")

if __name__ == "__main__":
    test_mail()
