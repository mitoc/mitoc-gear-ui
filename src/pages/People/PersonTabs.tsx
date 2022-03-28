type Props = {
  updateTab: (newTab: PersonPageTabs) => void;
  activeTab: PersonPageTabs;
};

export enum PersonPageTabs {
  gearOut = "gearOut",
  moreGear = "moreGear",
  buyGear = "buyGear",
  rentalHistory = "rentalHistory",
}

const tabs = [
  { name: PersonPageTabs.gearOut, label: "Gear out" },
  { name: PersonPageTabs.moreGear, label: "Rent Gear" },
  { name: PersonPageTabs.buyGear, label: "Buy Gear" },
  { name: PersonPageTabs.rentalHistory, label: "Rental History" },
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
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
