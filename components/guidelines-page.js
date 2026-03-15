"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function GuidelinesPage() {
  const { guidelines } = useDemo();

  return (
    <PageFrame
      title="Guidelines"
      description="Keep internal expectations clear and easy to review for every member of the TLRP staff team."
    >
      <div className="grid cols-2">
        {guidelines.map((group) => (
          <section className="panel" key={group.title}>
            <h3>{group.title}</h3>
            <div className="list">
              {group.items.map((item) => (
                <div className="list-item" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageFrame>
  );
}
