type Props = {
  updateTab: (newTab: PersonPageTabs) => void;
  activeTab: PersonPageTabs;
};

export enum PersonPageTabs {
  gearOut = "gearOut",
  moreGear = "moreGear",
  rentalHistory = "rentalHistory",
}

const tabs = [
  { name: PersonPageTabs.gearOut, label: "Gear out" },
  { name: PersonPageTabs.moreGear, label: "More Gear" },
  { name: PersonPageTabs.rentalHistory, label: "Rental History" },
];

export function PersonTabsSelector({ activeTab, updateTab }: Props) {
  return (
    <ul className="nav nav-tabs">
      {tabs.map((tab) => (
        <li className="nav-item">
          <button
            className={`nav-link ${tab.name === activeTab ? "active" : ""}`}
            onClick={() => updateTab(tab.name)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
