type Props = {
  updateTab: (newTab: PersonPageTabs) => void;
  activeTab: PersonPageTabs;
};

export enum PersonPageTabs {
  gearOut = "gearOut",
  moreGear = "moreGear",
  buyGear = "buyGear",
  approvals = "approvals",
  rentalHistory = "rentalHistory",
}

const tabs = [
  { name: PersonPageTabs.gearOut, label: "Gear out" },
  { name: PersonPageTabs.moreGear, label: "Rent", shortLabel: "Rent" },
  { name: PersonPageTabs.approvals, label: "Approvals", shortLabel: "Appr." },
  { name: PersonPageTabs.buyGear, label: "Buy", shortLabel: "Buy" },
  {
    name: PersonPageTabs.rentalHistory,
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
