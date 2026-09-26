// ============================================================================
// PORTFOLIO CONTENT — edit everything here.
// Swap images by dropping new files in src/assets/ and updating the imports.
// ============================================================================
import workChromatic from './assets/work-chromatic.jpg'
import workMechanicalHeart from './assets/work-mechanical-heart.jpg'
import workNeonDistrict from './assets/work-neon-district.jpg'
import workVelocity from './assets/work-velocity.jpg'
import workPrism from './assets/work-prism.jpg'
import aboutStudio from './assets/about-studio.jpg'

export const profile = {
  name: 'Niraj Jadhav',
  role: '3D Artist & Motion Designer',
  email: 'jadhavniraj793@gmail.com',
  instagram: 'https://instagram.com/nirajjadhav4834',
  linkedin: 'https://www.linkedin.com/in/niraj-jadhav-b313ba39a',
  github: 'https://github.com/jadhavniraj793-hue',
}

// size: 'lg' = large card (7 cols) · 'md' = medium (5 cols) · 'wide' = full width
export const projects = [
  {
    title: 'Chromatic Flow',
    category: '3D Motion Study',
    year: '2025',
    tools: 'Blender',
    size: 'lg',
    image: workChromatic,
  },
  {
    title: 'Mechanical Heart',
    category: 'Character Short',
    year: '2024',
    tools: 'Blender · Compositing',
    size: 'md',
    image: workMechanicalHeart,
  },
  {
    title: 'Neon District',
    category: 'Environment Design',
    year: '2024',
    tools: 'Blender · Look-dev',
    size: 'md',
    image: workNeonDistrict,
  },
  {
    title: 'Velocity',
    category: 'Product Film',
    year: '2025',
    tools: 'Blender · After Effects',
    size: 'lg',
    image: workVelocity,
  },
  {
    title: 'Prism Ident',
    category: 'Motion Ident',
    year: '2023',
    tools: 'After Effects · Illustrator',
    size: 'wide',
    image: workPrism,
  },
]

export const aboutImage = aboutStudio
