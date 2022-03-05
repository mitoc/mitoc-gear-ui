import { formatDateTime } from "lib/fmtDate";
import type { Person } from "apiClient/people";

type Props = {
  notes: Person["notes"];
};

export function Notes({ notes }: Props) {
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <h4>Notes</h4>
      {notes.map((note) => {
        return (
          <>
            <hr />
            <div>
              {formatDateTime(note.dateInserted)}, {note.author.firstName}{" "}
              {note.author.lastName}:
              <blockquote className="blockquote ps-3 fs-6">
                {note.note}
              </blockquote>
            </div>
          </>
        );
      })}
    </div>
  );
}
