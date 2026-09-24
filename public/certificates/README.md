# Certificate images

To display the **real certificate documents** inside the Certification Vault modal,
drop the scanned certificate images into this folder using these exact file names
(any of `.png`, `.jpg`, `.jpeg`, `.webp`):

| Certificate                                    | File name                            |
| ---------------------------------------------- | ------------------------------------ |
| OneRoadmap — Data Analyst                       | `oneroadmap-data-analyst.png`        |
| AWS — AI Practitioner Practice Question Set     | `aws-ai-practitioner-practice.png`   |
| Microsoft + LinkedIn — Azure Essentials         | `azure-essentials.png`               |
| Deloitte / Forage — Data Analytics Simulation   | `deloitte-data-analytics-simulation` |
| Business Analytics with Excel                   | `business-analytics-excel.jpg` ✅ added |
| Introduction to SQL                             | `introduction-to-sql.png`            |
| GenAI Powered Data Analytics Job Simulation     | `genai-data-analytics-simulation.png`|
| TCS iON Career Edge — Young Professional        | `tcs-ion-career-edge.png`            |

Then reference them in `src/data/content.ts` by adding an `image` field, e.g.:

```ts
{
  id: 'oneroadmap-data-analyst',
  ...
  image: `${import.meta.env.BASE_URL}certificates/oneroadmap-data-analyst.png`,
}
```

When an image is present, the certificate modal shows the real document and the
"View Certificate" button opens it full-size in a new tab. Until then, a styled
digital representation (with only the real, provided details) is displayed.
