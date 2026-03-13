# Specification

## Summary
**Goal:** Build "Lecture Vault," a single-user app for saving, organizing, and quickly accessing recorded lecture links in a drive/notebook-style interface.

**Planned changes:**
- Backend data model and API (add, retrieve, update, delete) for lecture entries with fields: title, URL, notes, label/category, and createdAt timestamp, stored in stable on-chain storage
- Add lecture form with required title and URL fields, optional notes and label, URL validation, and a success confirmation on save
- Drive-style card list view showing each entry's title, label badge, notes snippet, creation date, and an "Open Video" button that opens the URL in a new tab
- Real-time search bar filtering by title or notes, and a label/category dropdown filter
- Delete button on each card with a confirmation prompt that removes the entry from backend and updates the UI immediately
- Warm neutral (cream, amber, slate) notebook/drive-inspired visual theme with card-based layout, subtle shadows, and distinct label badge accent colors

**User-visible outcome:** Users can save recorded lecture links with metadata, browse them in a clean card layout, search/filter by keyword or category, open videos in a new tab, and delete entries they no longer need.
