import RecipeWriteForm from '@/components/features/community/RecipeWriteForm';

interface PageProps {
  params: { locale: string };
}

export default function RecipeWritePage({ params: { locale } }: PageProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <RecipeWriteForm locale={locale} />
    </div>
  );
}
