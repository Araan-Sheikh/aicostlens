import { AuditResultsClient } from "@/components/audit/AuditResultsClient";

type AuditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AuditPage({ params }: AuditPageProps) {
  const { id } = await params;

  return <AuditResultsClient auditId={id} />;
}
