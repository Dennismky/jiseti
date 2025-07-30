#!/usr/bin/env python3
"""
Script to test email functionality for record status updates
Run with: python test_email.py
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Record, NormalUser
from utils.emailer import send_status_email

def test_email_update():
    """Test updating a record status and sending email"""
    with app.app_context():
        # Find a draft record
        record = Record.query.filter_by(status='draft').first()
        
        if record:
            print(f"✅ Found draft record: '{record.title}' (ID: {record.id})")
            
            # Update status
            old_status = record.status
            record.status = 'approved'
            db.session.commit()
            print(f"✅ Status updated: {old_status} → {record.status}")
            
            # Find the user
            user = NormalUser.query.get(record.normal_user_id)
            
            if user:
                print(f"✅ Found user: {user.name} ({user.email})")
                
                # Prepare email
                subject = "Update on Your Record Status"
                message = f"""Hello {user.name},

Your record titled "{record.title}" has been updated.
Status: {old_status} ➝ {record.status}

Thank you for using Jiseti.

- Jiseti Admin Team"""
                
                # Send email
                try:
                    send_status_email(user.email, subject, message)
                    print("✅ Email sent successfully!")
                except Exception as e:
                    print(f"❌ Error sending email: {e}")
            else:
                print("❌ User not found.")
        else:
            print("❌ No draft record found.")
            
            # Show all records for debugging
            print("\n--- All Records ---")
            records = Record.query.all()
            if records:
                for r in records:
                    print(f"ID: {r.id}, Title: {r.title}, Status: {r.status}")
            else:
                print("No records found in database.")

if __name__ == "__main__":
    test_email_update()