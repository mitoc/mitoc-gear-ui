import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  updateTab: (newTab: PersonPageTabs) => void;
  activeTab: PersonPageTabs;
};

export enum PersonPageTabs {
  gearOut = "gearOut",
  rent = "rent",
  buy = "buy",
  approvals = "approvals",
  history = "history",
}

const tabs = [
  { name: PersonPageTabs.gearOut, label: "Gear out" },
  { name: PersonPageTabs.rent, label: "Rent", shortLabel: "Rent" },
  { name: PersonPageTabs.approvals, label: "Approvals", shortLabel: "Appr." },
  { name: PersonPageTabs.buy, label: "Buy", shortLabel: "Buy" },
  {
    name: PersonPageTabs.history,
    label: "History",
    shortLabel: "Hist.",
  },
];

export function PersonTabsSelector({ activeTab, updateTab }: Props) {
  return (
    <ul className="nav nav-tabs">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.name}>
          <button
            className={`nav-link ${tab.name === activeTab ? "active" : ""}`}
            onClick={() => updateTab(tab.name)}
          >
            <span className="d-none d-md-inline">{tab.label}</span>
            <span className="d-md-none">{tab.shortLabel ?? tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function useTab(): [PersonPageTabs, (newTab: PersonPageTabs) => void] {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");
  const tab = Object.values(PersonPageTabs).includes(tabParam as PersonPageTabs)
    ? (tabParam as PersonPageTabs)
    : PersonPageTabs.gearOut;

  const setTab = (newTab: PersonPageTabs) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("tab", newTab);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  return [tab, setTab];
}
