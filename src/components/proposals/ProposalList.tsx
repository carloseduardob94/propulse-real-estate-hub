
import { ProposalCard } from "./ProposalCard";
import { ReusablePagination } from "@/components/ui/reusable-pagination";

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  createdAt: string;
  propertyCount: number;
  status: string;
}

interface ProposalListProps {
  proposals: Proposal[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function ProposalList({ proposals, currentPage, itemsPerPage, onPageChange }: ProposalListProps) {
  const indexOfLastProposal = currentPage * itemsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - itemsPerPage;
  const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);
  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentProposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
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
