import React, { useState } from "react";

import { formatDateTime } from "lib/fmtDate";
import type { Person } from "apiClient/people";
import { TextArea } from "components/Inputs/TextArea";

type Props = {
  notes: Person["notes"];
  onAdd: (note: string) => Promise<any>;
  onArchive?: (id: string) => void;
};

export function Notes({ notes, onAdd, onArchive }: Props) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");

  console.log(onArchive);
  return (
    <div className="border rounded-2 p-2 mb-3 bg-light">
      <div className="d-flex justify-content-between">
        <h4>Notes</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "-" : "+"}
        </button>
      </div>
      {showForm && (
        <form>
          <label className="form-group w-100 mb-2">
            New note:
            <TextArea
              className="w-100"
              value={newNote}
              onChange={setNewNote}
            ></TextArea>
          </label>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!newNote}
            onClick={(evt) => {
              evt.preventDefault();
              onAdd(newNote).then(() => {
                setShowForm(false);
                setNewNote("");
              });
            }}
          >
            Add note
          </button>
        </form>
      )}
      {notes.map((note) => {
        return (
          <React.Fragment key={note.dateInserted}>
            <hr />
            <div className="d-flex justify-content-between">
              <div>
                {formatDateTime(note.dateInserted)}, {note.author.firstName}{" "}
                {note.author.lastName}:
                <blockquote className="blockquote ps-3 fs-6">
                  {note.note}
                </blockquote>
              </div>
              {onArchive && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => onArchive(note.id)}
                >
                  ⬇
                </button>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
