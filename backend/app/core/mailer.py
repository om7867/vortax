import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAILS_FROM_NAME = os.getenv("EMAILS_FROM_NAME", "PathIQ Support")
EMAILS_FROM_EMAIL = os.getenv("EMAILS_FROM_EMAIL", "noreply@pathiq.com")
FRONTEND_HOST = os.getenv("FRONTEND_HOST", "http://localhost:5173")

def send_reset_password_email(email_to: str, token: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("[WARNING] SMTP_USER or SMTP_PASSWORD not set. Email not sent.")
        print(f"[SECURITY] Reset link: {FRONTEND_HOST}/reset-password?token={token}")
        return False

    subject = f"Password Reset Request - {EMAILS_FROM_NAME}"
    reset_link = f"{FRONTEND_HOST}/reset-password?token={token}"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #16a34a;">PathIQ Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your PathIQ account. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background-color: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.8em; color: #777;">
                    PathIQ - Master your future skills.
                </p>
            </div>
        </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{EMAILS_FROM_NAME} <{EMAILS_FROM_EMAIL}>"
    message["To"] = email_to

    message.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(EMAILS_FROM_EMAIL, email_to, message.as_string())
        print(f"[SUCCESS] Reset email sent to {email_to}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        return False
