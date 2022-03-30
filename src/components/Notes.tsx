import React, { useState } from "react";

import { formatDateTime } from "lib/fmtDate";
import type { Person } from "apiClient/people";
import { TextArea } from "components/Inputs/TextArea";
import { ToggleExpandButton, ArchiveButton } from "components/Buttons";

type Props = {
  notes: Person["notes"];
  onAdd: (note: string) => Promise<any>;
  onArchive?: (id: string) => void;
};

export function Notes({ notes, onAdd, onArchive }: Props) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");

  return (
    <div className="border rounded-2 p-2 pe-3 mb-3 bg-light">
      <div className="d-flex justify-content-between">
        <h4>Notes</h4>
        <ToggleExpandButton
          isOpen={showForm}
          onClick={() => setShowForm((s) => !s)}
        />
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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {formatDateTime(note.dateInserted)}, {note.author.firstName}{" "}
                {note.author.lastName}:
                <blockquote className="blockquote ps-3 fs-6">
                  {note.note}
                </blockquote>
              </div>
              {onArchive && (
                <ArchiveButton onClick={() => onArchive(note.id)} />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
