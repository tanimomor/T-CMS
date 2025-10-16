'use client';

import { useEffect } from 'react';
import { useContentTypesStore } from '@/cms/lib/stores/content-types';
import { useComponentsStore } from '@/cms/lib/stores/components';
import { useEntriesStore } from '@/cms/lib/stores/entries';
import { useMediaStore } from '@/cms/lib/stores/media';
import { useSettingsStore } from '@/cms/lib/stores/settings';

export function useInitData() {
  const { contentTypes, createContentType } = useContentTypesStore();
  const { components, createComponent } = useComponentsStore();
  const { entries, createEntry } = useEntriesStore();
  const { mediaFiles, addMediaFile } = useMediaStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    // Only initialize if no data exists
    if (contentTypes.length === 0 && components.length === 0 && entries.length === 0) {
      initializeMockData();
    }
  }, [contentTypes.length, components.length, entries.length]);

  const initializeMockData = () => {
    // Create sample components first
    const seoComponent = createComponent({
      name: 'seo',
      displayName: 'SEO',
      description: 'Search engine optimization fields',
      category: 'SEO',
      icon: 'Search',
      isRepeatable: false,
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'longtext',
          required: false,
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
          required: false,
        },
        {
          name: 'ogImage',
          type: 'media',
          required: false,
          mediaType: 'image',
        },
      ],
    });

    const faqItemComponent = createComponent({
      name: 'faqItem',
      displayName: 'FAQ Item',
      description: 'Frequently asked question item',
      category: 'Content',
      icon: 'HelpCircle',
      isRepeatable: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richtext',
          required: true,
        },
      ],
    });

    const testimonialComponent = createComponent({
      name: 'testimonial',
      displayName: 'Testimonial',
      description: 'Customer testimonial',
      category: 'Content',
      icon: 'Quote',
      isRepeatable: true,
      fields: [
        {
          name: 'quote',
          type: 'longtext',
          required: true,
        },
        {
          name: 'authorName',
          type: 'text',
          required: true,
        },
        {
          name: 'authorTitle',
          type: 'text',
          required: false,
        },
        {
          name: 'authorPhoto',
          type: 'media',
          required: false,
          mediaType: 'image',
        },
        {
          name: 'company',
          type: 'text',
          required: false,
        },
        {
          name: 'rating',
          type: 'number',
          required: false,
          min: 1,
          max: 5,
        },
      ],
    });

    // Create sample content types
    const articleContentType = createContentType({
      name: 'article',
      displayName: 'Article',
      description: 'Blog articles and news posts',
      kind: 'collection',
      apiId: 'article',
      draftAndPublish: true,
      i18n: false,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 255,
        },
        {
          name: 'slug',
          type: 'uid',
          required: true,
          uidTarget: 'title',
        },
        {
          name: 'content',
          type: 'richtext',
          required: true,
        },
        {
          name: 'excerpt',
          type: 'longtext',
          required: false,
          maxLength: 500,
        },
        {
          name: 'coverImage',
          type: 'media',
          required: false,
          mediaType: 'image',
        },
        {
          name: 'publishedAt',
          type: 'datetime',
          required: false,
        },
        {
          name: 'seo',
          type: 'component',
          required: false,
          componentId: seoComponent.id,
        },
        {
          name: 'faqs',
          type: 'repeatable-component',
          required: false,
          componentId: faqItemComponent.id,
        },
      ],
    });

    const homepageContentType = createContentType({
      name: 'homepage',
      displayName: 'Homepage',
      description: 'Main homepage content',
      kind: 'single',
      apiId: 'homepage',
      draftAndPublish: true,
      i18n: false,
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'heroSubtitle',
          type: 'longtext',
          required: false,
        },
        {
          name: 'heroImage',
          type: 'media',
          required: false,
          mediaType: 'image',
        },
        {
          name: 'testimonials',
          type: 'repeatable-component',
          required: false,
          componentId: testimonialComponent.id,
        },
        {
          name: 'seo',
          type: 'component',
          required: false,
          componentId: seoComponent.id,
        },
      ],
    });

    // Create sample entries
    createEntry({
      contentTypeId: articleContentType.id,
      status: 'published',
      locale: 'en',
      data: {
        title: 'Welcome to Our CMS',
        slug: 'welcome-to-our-cms',
        content: '<p>This is a sample article created to demonstrate the CMS functionality. You can edit this content or create new articles using the content manager.</p><p>The CMS supports rich text editing, media uploads, and flexible content structures.</p>',
        excerpt: 'A sample article demonstrating CMS features',
        publishedAt: new Date().toISOString(),
        seo: {
          metaTitle: 'Welcome to Our CMS - Sample Article',
          metaDescription: 'Learn about our CMS features and capabilities',
          keywords: 'cms, content management, sample',
        },
        faqs: [
          {
            question: 'What is this CMS?',
            answer: '<p>This is a modern content management system built with Next.js and TypeScript.</p>',
          },
          {
            question: 'How do I create content?',
            answer: '<p>Use the Content Manager to create and edit your content entries.</p>',
          },
        ],
      },
      createdBy: 'admin',
      updatedBy: 'admin',
    });

    createEntry({
      contentTypeId: homepageContentType.id,
      status: 'published',
      locale: 'en',
      data: {
        heroTitle: 'Welcome to Our Website',
        heroSubtitle: 'Discover amazing content and features',
        testimonials: [
          {
            quote: 'This CMS is amazing! It makes content management so easy.',
            authorName: 'John Doe',
            authorTitle: 'CEO',
            company: 'Example Corp',
            rating: 5,
          },
          {
            quote: 'The best content management system I\'ve ever used.',
            authorName: 'Jane Smith',
            authorTitle: 'Marketing Director',
            company: 'Sample Inc',
            rating: 5,
          },
        ],
        seo: {
          metaTitle: 'Homepage - Welcome to Our Website',
          metaDescription: 'Discover our amazing content and features',
          keywords: 'homepage, welcome, features',
        },
      },
      createdBy: 'admin',
      updatedBy: 'admin',
    });

    // Create sample media files
    addMediaFile({
      name: 'Sample Image',
      filename: 'sample-image.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      width: 1920,
      height: 1080,
      url: '/api/media/sample-image.jpg',
      alt: 'Sample image for demonstration',
      caption: 'This is a sample image',
    });

    addMediaFile({
      name: 'Company Logo',
      filename: 'logo.png',
      mimeType: 'image/png',
      size: 512000,
      width: 512,
      height: 512,
      url: '/api/media/logo.png',
      alt: 'Company logo',
    });
  };
}
