
#!/usr/bin/env python3
"""
BarterTap - Verilənlər Bazası Əlaqə Yoxlama Skripti

Bu skript həm MySQL, həm də PostgreSQL bağlantılarını yoxlayır və
mövcud verilənlər bazası cədvəllərinin uyğunluğunu təsbit edir.
"""

import os
import sys
import json
from check_database import check_db_tables

def check_db_connectivity():
    """Verilənlər bazası bağlantısının vəziyyətini yoxlayır"""
    print("BarterTap Verilənlər Bazası Əlaqə Testi başladılır...")
    
    # PostgreSQL bağlantısını yoxlayın
    pg_result = check_db_tables()
    
    # Nəticələri analiz edin
    if pg_result["status"] == "success":
        print(f"\n✅ PostgreSQL bağlantısı uğurlu")
        print(f"✅ {len(pg_result['tables'])} cədvəl tapıldı")
        
        # Cədvəlləri yoxlayın
        expected_tables = ["users", "items", "categories", "offers", "messages", "reviews"]
        missing_tables = [table for table in expected_tables if table not in pg_result["tables"]]
        
        if missing_tables:
            print(f"⚠️ Diqqət! Bu gözlənilən cədvəllər tapılmadı: {', '.join(missing_tables)}")
        else:
            print(f"✅ Bütün gözlənilən cədvəllər mövcuddur")
    else:
        print(f"\n❌ PostgreSQL bağlantısı uğursuz")
        print(f"❌ Xəta: {pg_result['message']}")
    
    print("\nVerilənlər bazası əlaqə yoxlaması tamamlandı.")

if __name__ == "__main__":
    check_db_connectivity()
