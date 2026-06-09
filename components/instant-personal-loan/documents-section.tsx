'use client';

/**
 * Documents Required section with Salaried / Self-Employed toggle.
 */

import { JSX, useState } from 'react';
import Image from 'next/image';
import {
  DOCUMENTS_SECTION_DESCRIPTION,
  DOCUMENTS_SECTION_TITLE,
  SALARIED_DOCUMENTS,
  SELF_EMPLOYED_DOCUMENTS,
  type DocumentItem,
} from './constants';
import { IMAGES } from '@/lib/constants/images';

type EmploymentType = 'salaried' | 'self-employed';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps): JSX.Element => {
  const activeStyles = 'bg-brand-primary text-white';
  const inactiveStyles = 'bg-transparent text-gray-700';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors ${
        isActive ? activeStyles : inactiveStyles
      }`}
    >
      {label}
    </button>
  );
};

interface DocumentRowProps {
  document: DocumentItem;
}

const DocumentRow = ({ document }: DocumentRowProps): JSX.Element => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full  flex items-center justify-center shrink-0 mt-0.5">
        <Image src={IMAGES.ICONS.DOCUMENT} alt="Check" width={24} height={24} />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-800">{document.title}</span>
        <br />
        <span className="text-sm text-gray-500 leading-5">{document.description}</span>
      </div>
    </div>
  );
};

const DocumentsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<EmploymentType>('salaried');

  const documents = activeTab === 'salaried' ? SALARIED_DOCUMENTS : SELF_EMPLOYED_DOCUMENTS;

  const handleSalariedClick = (): void => setActiveTab('salaried');
  const handleSelfEmployedClick = (): void => setActiveTab('self-employed');

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="ipl-heading">
          {DOCUMENTS_SECTION_TITLE}
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-5">
          {DOCUMENTS_SECTION_DESCRIPTION}
        </p>

        {/* Employment type toggle */}
        <div className="flex justify-center mb-6">
          <div className="w-60 h-10 bg-brand-primary/15 rounded-lg p-1 flex items-center">
            <TabButton
              label="Salaried"
              isActive={activeTab === 'salaried'}
              onClick={handleSalariedClick}
            />
            <TabButton
              label="Self-Employed"
              isActive={activeTab === 'self-employed'}
              onClick={handleSelfEmployedClick}
            />
          </div>
        </div>

        <div className="space-y-5">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
