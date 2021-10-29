import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { peopleClient, PersonSummary } from "apiClient/people";

export default function PeoplePage() {
  const [people, setPeople] = useState<PersonSummary[] | null>(null);
  useEffect(() => {
    peopleClient.getPersonList().then((data) => {
      setPeople(data.results);
    });
  }, []);
  console.log(people);
  return <span />;
}
