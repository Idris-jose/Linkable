# TODO: Change QR Code Link to Use User's Name Instead of UID

## Steps to Complete:
- [ ] Update Qrcode.jsx: Change profileUrl to use encodeURIComponent(user.displayName) instead of user.uid
- [ ] Update App.jsx: Change route from /profile/:userId to /profile/:name
- [ ] Update SharedProfile.jsx: Change param to name, decode it, add query to find UID by displayName, update share URL to use name
