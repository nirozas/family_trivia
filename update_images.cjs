const fs = require('fs');
const path = require('path');

const CATEGORY_IMAGES = {
  'animal-kingdom': ['1546182990-dffeafbe841d', '1502602898657-3e91760cbb34', '1551244072-5d12893278ab', '1523482580672-f109ba8cb9be'],
  'the-global-kitchen': ['1504674900247-0877df9cc836', '1506368249032-aa3da3003844', '1551183053-bf91a1d81140', '1498837167923-8881ca4a48d8'],
  'time-machine-history': ['1539650116574-75c0c6d73f6e', '1505833280578-184e2729934c', '1518709268805-4e9042af9f23', '1446776811953-b23d57bd21aa'],
  'the-lab-science': ['1532187863486-dbf7b73d9171', '1507413245164-6160d8298b31', '1446776811953-b23d57bd21aa', '1581093450021-4a7360e9a6ad'],
  'expedition-geography': ['1526772662000-3f88f10c053e', '1464822759023-fed622ff2c3b', '1477332552946-cfb384aeaf1c', '1449034446853-66c86144b0ad'],
  'brain-flex-math-challenges': ['1509228463518-180dd48235d8', '1587141744123-998b36382421', '1635070041078-e363dbe005cb'],
  'arts-masterpieces': ['1579783902614-a3fb3927b6a5', '1578301978693-85fa9c0320b9', '1544531585-98329495a05a'],
  'disney-animation-magic': ['1535615611114-3d097949312d', '1598897500694-aa1e99626425', '1501446529957-6226bd447c46'],
  'weird-but-true': ['1518531933037-91b2f5f229cc', '1509248961158-e67f6934749c', '1530026405186-ed1f139313f8'],
  'global-trailblazers': ['1519389950473-47ba0277781c', '1472746729193-36ad213cd41e', '1452421822248-d4c2b47f0c81'],
  'the-pitch-soccer-beyond': ['1461891263870-bd609328af7b', '1508098682722-e99c43a406b2', '1541534741688-64658829df73'],
  'world-shapers-global-icons': ['1519389950473-47ba0277781c', '1521791136033-39d04708320b', '1507679799987-c7377be14532'],
  'screen-time-modern-tech-apps': ['1518770660439-4636190af475', '1498050108023-c5249f4df085', '1511707171634-5f897ff02aa9'],
  'daily-life-inventions': ['1493612216891-c7ed1e060ad7', '1581091226823-a3b228b7a216', '1555664424-a8ba73d551b9'],
  'riddle-me-this': ['1518152002737-08f566939ee7', '1484069019133-9d636308453c', '1534447677768-be436bb09401']
};

const DATA_DIR = path.join(__dirname, 'src', 'data', 'categories');
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const categoryKey = file.replace('.ts', '');
  const images = CATEGORY_IMAGES[categoryKey];
  if (!images) return;

  const filePath = path.join(DATA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Clean up ALL existing image properties and potential double commas
  content = content.replace(/["']?image["']?:\s*["'][^"']*["'],?/g, '');
  content = content.replace(/,\s*,/g, ',');

  // 2. Identify question blocks and add images
  const questionRegex = /\{[\s\S]*?["']?id["']?:\s*["'][^"']*["'][\s\S]*?\}/g;
  
  let count = 0;
  content = content.replace(questionRegex, (block) => {
    const imageId = images[count % images.length];
    count++;
    const imageUrl = `https://images.unsplash.com/photo-${imageId}?w=500&h=250&fit=crop`;
    
    // Ensure the block doesn't already have a trailing comma before the closing brace
    let cleanedBlock = block.trim().replace(/,?\s*\}\s*$/, '');
    return cleanedBlock + `,\n    image: "${imageUrl}"\n  }`;
  });

  // Final pass for any accidental triple commas or artifacts
  content = content.replace(/,\s*,/g, ',');

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned and Refreshed ${file} with ${count} images.`);
});
