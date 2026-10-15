import { GraduationCap } from "lucide-react";
import { IconTreatment } from "@/components/ui/icon-treatment";
import type { EducationRecord } from "@/types/portfolio";

export function Education({
  records,
}: {
  records: readonly EducationRecord[];
}) {
  return (
    <section
      className="education editorial-panel editorial-panel-peach"
      aria-labelledby="education-title"
    >
      <div className="education-heading">
        <IconTreatment>
          <GraduationCap size={22} aria-hidden="true" />
        </IconTreatment>
        <h3 id="education-title">Education</h3>
      </div>
      <div>
        {records.map((record, index) => (
          <div key={`${record.institution}-${index}`}>
            <p className="education-program">{record.program}</p>
            <p className="education-institution">{record.institution}</p>
            {(record.startDate || record.endDate) && (
              <p className="education-institution">
                {[record.startDate, record.endDate].filter(Boolean).join(" – ")}
              </p>
            )}
            {record.description && (
              <p className="education-description">{record.description}</p>
            )}
            {records.length > 1 && (
              <p className="education-status">{record.status}</p>
            )}
          </div>
        ))}
      </div>
      {records.length === 1 && (
        <span className="education-status">{records[0]?.status}</span>
      )}
    </section>
  );
}
