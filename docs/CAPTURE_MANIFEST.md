# Phase 2 capture manifest

22 November 2026, managed desktop Chrome. Application revision `8808456` and fixture `PC-FOUNDATION-01 v1.0`. Browser viewport 1363 × 936 CSS pixels at DPR 1. Each source is an unedited viewport capture with a matching rendered-tree snapshot in `docs/evidence/phase2/`. Chrome's available capture surface exports JPEG. Its native PNG command was unavailable because the browser blocked DevTools for the preview.

| Source filename | Live source route | Choices and pane | Alt text | Intended destination |
|---|---|---|---|---|
| bento-mail.jpg | /demo/ | Fresh self-paced run. Rahul selected, before D1. | Rahul asks who owns the demo server recovery check. | /skillproof#mailbox |
| bento-board.jpg | /demo/ | Fresh self-paced run, D1 A. Tasks opened with Recovery check assigned to Rahul and In progress. | The recovery check is assigned to Rahul and marked In progress. | /demo?tool=tasks |
| bento-brief.jpg | /simulations/ | Fresh navigation, Project Coordinator and Foundation defaults. | Foundation brief for the playable Project Coordinator role. | /simulations |
| bento-credential.jpg | /trustchain/#credential | Fresh navigation, employer DEMO-ORG-04. Opened Reference details to expose Network: none. | Sample employer record with a fictional verification status. | /trustchain#credential |
| bento-evidence.jpg | /fairhire/#report | Fresh canonical A/A/A fixture, selected Client communication source. | A sample communication finding points to the reply to Alex. | /fairhire#report |

Procedure. Open the source route in the production export. Reset between fixtures with a fresh navigation or hard reload. Use the live controls described in the table. Save the browser viewport and rendered tree from the same state. No layout was composited and no text was added to the images.

## Crops and delivery

The following pixel rectangles use `left, top, right, bottom` on the captured viewport. Scale each single crop to fit within 79% of the listed master dimensions and center it on a solid matte. Export PNG, then resize to 400 px, 800 px and the listed master width using Lanczos. Encode WebP at quality 88 and AVIF at quality 72. The PNGs encode the received JPEG source without further lossy compression. True lossless originals remain outstanding.

| Stem | Crop | Master | Selected item in central 80% |
|---|---|---|---|
| bento-mail | 0, 0, 1363, 700 | 1440 × 900 | Fictional label, Rahul and recovery subject |
| bento-board | 0, 0, 1363, 565 | 1200 × 900 | Fictional label and Rahul’s In progress recovery check |
| bento-brief | 365, 280, 1010, 620 | 960 × 720 | Fictional label, Foundation and Project Coordinator |
| bento-credential | 562, 88, 1320, 683 | 960 × 720 | Fictional label, DEMO-ORG-04, status and network |
| bento-evidence | 65, 105, 820, 870 | 960 × 720 | Fictional label, C-017 and Alex’s reply |

## Candidate walkthrough

`candidate-walkthrough.mp4` is one continuous timed A/A/A run on `/demo/`, sampled from the real production frontend. The contact sheet was used only for review. The encoded picture uses 1,106 timestamped images captured at a managed browser crop of 1362 × 766. Hold each captured image until the next recorded timestamp, resample to 30 fps and scale to 1920 × 1080 using Lanczos. Encode with FFmpeg H.264 CRF 20 and a silent AAC track. The timeline records actual action times. The companion English captions and transcript are timed against that sequence.

The poster is the real film frame at 00:12.500, scaled to 960 × 540 and encoded as WebP. Rahul is selected and Alex is unread. Human narration is an owner action.

The finance-first FairHire control put Financial judgement first. The capture check also required the closing employer-demo link in the approved shot sheet. It was absent from the current Phase 1 workspace, so the employer film and its public tile are deferred.
