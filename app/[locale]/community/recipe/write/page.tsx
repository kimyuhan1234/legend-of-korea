import RecipeWriteForm from '@/components/features/community/RecipeWriteForm';

interface PageProps {
  params: { locale: string };
}

export default function RecipeWritePage({ params: { locale } }: PageProps) {
  return (
    <div className="min-h-screen bg-cloud">
      <RecipeWriteForm locale={locale} />
    </div>
  );
}
