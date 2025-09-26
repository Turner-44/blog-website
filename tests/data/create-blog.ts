import { faker } from '@faker-js/faker';

const title = faker.book.title();

const markdown = `
# Cats 🐱

Cats are one of the most popular pets in the world.  
They are independent, curious, and often hilarious companions.

---

## Fun Facts

- Cats sleep **12–16 hours** a day.  
- They communicate with humans through **meows, purrs, and body language**.  
- Each cat has a **unique personality**—some are playful, others are aloof.  

---
`;

export const createBlogData = {
  title,
  slug: title.replaceAll(' ', '-').toLowerCase(),
  summary: faker.lorem.sentence(),
  markdown: markdown,
  tags: ['test'],
  featureImagePath: 'data/images/feel-old.jpg',
};
