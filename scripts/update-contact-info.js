#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contact bilgileri
const CONTACT_INFO = {
  phone: "+90 532 574 26 82",
  phoneRaw: "+905325742682",
  email: "sbstravelinfo@gmail.com"
};

// Değiştirilecek patternler
const patterns = [
  // Telefon numaraları
  { from: /\+90\s*532\s*574\s*26\s*82/g, to: CONTACT_INFO.phone },
  { from: /tel:\+90 532 574 26 82/g, to: `tel:${CONTACT_INFO.phoneRaw}` },
  
  // E-posta adresleri
  { from: /info@sbstravel\.net/g, to: CONTACT_INFO.email },
  { from: /sbstravel@gmail\.com/g, to: CONTACT_INFO.email },
  { from: /kvkk@sbstravel\.net/g, to: CONTACT_INFO.email },
  { from: /info@sbstransfer\.com/g, to: CONTACT_INFO.email },
  { from: /info@sonstransfer\.com/g, to: CONTACT_INFO.email },
  
  // mailto linkleri
  { from: /mailto:info@sbstravel\.net/g, to: `mailto:${CONTACT_INFO.email}` },
  { from: /mailto:sbstravel@gmail\.com/g, to: `mailto:${CONTACT_INFO.email}` },
  { from: /mailto:kvkk@sbstravel\.net/g, to: `mailto:${CONTACT_INFO.email}` },
  { from: /mailto:info@sbstransfer\.com/g, to: `mailto:${CONTACT_INFO.email}` },
  { from: /mailto:info@sonstransfer\.com/g, to: `mailto:${CONTACT_INFO.email}` }
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    patterns.forEach(pattern => {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.html']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // node_modules ve .git klasörlerini atla
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          walk(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    });
  }
  
  walk(dir);
  return files;
}

function main() {
  console.log('🔄 Contact bilgilerini güncelleniyor...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  const files = walkDirectory(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (updateFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\n✨ Tamamlandı! ${updatedCount} dosya güncellendi.`);
  console.log(`📞 Telefon: ${CONTACT_INFO.phone}`);
  console.log(`📧 E-posta: ${CONTACT_INFO.email}`);
}

main();
