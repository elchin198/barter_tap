/**
 * NextBarter üçün test datalarını yaratmaq üçün script
 * Bu skript, test istifadəçiləri və elanlar yaradaraq platformanı doldurur.
 */
import { seedAll } from './server/seeds/index.js';

// console.log('🚀 NextBarter - Test Data Yaratma Utility');
// console.log('===========================================');

seedAll()
  .then(results => {
    // console.log(`\nÜmumi Nəticələr:`);
    // console.log(`  👥 ${results.users.length} istifadəçi yaradıldı`);
    // console.log(`  📦 ${results.items.length} elan yaradıldı`);
    // console.log('\n✨ Test məlumatları uğurla yaradıldı!');
    // console.log('\nQeyd: Bütün test istifadəçilərin şifrəsi: password123');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test məlumatlarının yaradılması zamanı xəta baş verdi:');
    console.error(error);
    process.exit(1);
  });