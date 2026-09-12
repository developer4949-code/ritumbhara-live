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
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      console.error('Missing GitHub environment variables');
      return NextResponse.json(
        { error: 'GitHub configuration is missing' },
        { status: 500 }
      );
    }

    try {
      // 1. Get current file SHA from the specific branch
      const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/properties.json?ref=feature/seo-optimization`;
      const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/properties.json`;
      
      const getRes = await fetch(getUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
        cache: 'no-store',
      });

      if (!getRes.ok) {
        const errorText = await getRes.text();
        console.error('GitHub GET failed:', getRes.status, errorText);
        return NextResponse.json(
          { error: 'Failed to read properties from GitHub' },
          { status: 502 }
        );
      }

      const getJson = await getRes.json();
      
      // 2. Update file
      const content = Buffer.from(JSON.stringify(properties, null, 2)).toString('base64');
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update properties and SEO via Admin Panel',
          content: content,
          sha: getJson.sha,
          branch: 'feature/seo-optimization'
        })
      });
      
      if (!putRes.ok) {
        const errorText = await putRes.text();
        console.error('GitHub PUT failed:', putRes.status, errorText);
        return NextResponse.json(
          { error: 'Failed to save properties to GitHub' },
          { status: 502 }
        );
      }
      
      return NextResponse.json({ success: true, message: 'Saved to GitHub' });
    } catch (error) {
      console.error('GitHub save error:', error);
      return NextResponse.json(
        { error: 'Failed to save to GitHub' },
        { status: 500 }
      );
    }
  }
}
