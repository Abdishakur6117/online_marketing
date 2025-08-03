import CustomerReport from "./CustomerReport";
import MarketerReport from "./MarketerReport";

export default function ReportPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Customer Report</h2>
        <CustomerReport />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Marketer Report</h2>
        <MarketerReport />
      </section>
    </div>
  );
}
