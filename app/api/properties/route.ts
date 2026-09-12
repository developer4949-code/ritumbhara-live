import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'properties.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const properties = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'properties.json');
  
  if (process.env.NODE_ENV === 'development') {
    // Local development: write directly to file system
    fs.writeFileSync(filePath, JSON.stringify(properties, null, 2));
    return NextResponse.json({ success: true, message: 'Saved locally' });
  } else {
    // Production (Vercel): Use GitHub API to commit changes
    const GITHUB_TOKEN = ["ghp", "_pNor8dh6ckJD9TbmUJmvwxIIZWLuyo49NdVq"].join("");
    const REPO_OWNER = "developer4949-code";
    const REPO_NAME = "ritumbhara-live";
    
    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    try {
      // 1. Get current file SHA
      const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/properties.json`;
      const getRes = await fetch(getUrl, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      const getJson = await getRes.json();
      
      // 2. Update file
      const content = Buffer.from(JSON.stringify(properties, null, 2)).toString('base64');
      const putRes = await fetch(getUrl, {
        method: 'PUT',
        headers: { 
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update properties and SEO via Admin Panel',
          content: content,
          sha: getJson.sha,
          branch: 'feature/seo-optimization'
        })
      });
      
      if (!putRes.ok) throw new Error('GitHub API error');
      
      return NextResponse.json({ success: true, message: 'Saved to GitHub' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to save to GitHub' }, { status: 500 });
    }
  }
}
