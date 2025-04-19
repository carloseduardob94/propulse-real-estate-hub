
import { Lead } from "@/types";
import { LeadCard } from "./LeadCard";
import { ReusablePagination } from "@/components/ui/reusable-pagination";

interface LeadListProps {
  leads: Lead[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function LeadList({ leads, currentPage, itemsPerPage, onPageChange }: LeadListProps) {
  const indexOfLastLead = currentPage * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {totalPages > 1 && (
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
