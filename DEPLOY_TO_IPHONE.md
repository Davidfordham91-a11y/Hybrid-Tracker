# Deploy Version 3 To iPhone

This tracker is a static local-first PWA. It has no backend and no login. When opened on your iPhone, workout data is stored in Safari localStorage for that exact website URL.

For existing data continuity, deploy Version 3 to the same Netlify site URL you already use:

`https://davidhybridtracker.netlify.app`

## Fastest Path: Netlify Drop

1. Open `https://app.netlify.com/drop` on your PC.
2. Drag the `hybrid-marathon-tracker-deploy` folder onto the page.
3. Netlify gives you an HTTPS URL.
4. Open that URL in iPhone Safari.
5. Tap Share, then Add to Home Screen.

## Cloudflare Pages

1. Create a new Cloudflare Pages project.
2. Upload this folder or the deploy zip.
3. Use the generated HTTPS URL on iPhone Safari.
4. Tap Share, then Add to Home Screen.

## Important

- Do not change the hosted URL casually. Safari localStorage is tied to the URL.
- If you deploy to the same URL, Version 3 migrates existing data automatically.
- Use Export JSON before moving to a new URL or clearing Safari data.
- After importing a JSON backup on the new URL, continue logging there.
- HTTPS hosting is preferred. Local Wi-Fi serving can fail because of Windows Firewall, VPN routing, or router client isolation.
