import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');
const publicDir = join(projectRoot, 'public');

async function checkFileExists(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

async function verifyPublicFiles() {
  console.log('Verifying public files in dist folder...');
  
  // Check if dist directory exists
  try {
    await stat(distDir);
  } catch (error) {
    console.error('❌ Dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // List of critical files to check
  const criticalFiles = [
    'sitemap.xml',
    'robots.txt',
    'vite.svg'
  ];
  
  let allFilesExist = true;
  
  // Check each critical file
  for (const file of criticalFiles) {
    const filePath = join(distDir, file);
    const exists = await checkFileExists(filePath);
    
    if (exists) {
      console.log(`✅ ${file} found in dist folder`);
    } else {
      console.error(`❌ ${file} not found in dist folder`);
      allFilesExist = false;
    }
  }
  
  // List all files in public directory
  try {
    const publicFiles = await readdir(publicDir);
    console.log('\nAll files in public directory:');
    for (const file of publicFiles) {
      console.log(`- ${file}`);
    }
  } catch (error) {
    console.error('Error reading public directory:', error);
  }
  
  // List all files in dist directory
  try {
    const distFiles = await readdir(distDir);
    console.log('\nAll files in dist directory:');
    for (const file of distFiles) {
      console.log(`- ${file}`);
    }
  } catch (error) {
    console.error('Error reading dist directory:', error);
  }
  
  if (allFilesExist) {
    console.log('\n✅ All critical public files are present in the dist folder');
  } else {
    console.error('\n❌ Some critical public files are missing from the dist folder');
    process.exit(1);
  }
}

verifyPublicFiles().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
}); 