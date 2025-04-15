import Link from "next/link";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Links",
    links: [
      { text: "Home", url: "/" },
      { text: "Resources", url: "/resources" },
      { text: "Blogs", url: "/blogs" },
      { text: "Q&A", url: "/questions" },
    ],
  },
];

export default function Footer() {
  return (
    <section className="py-24">
      <div className="container pt-8 px-10 md:px-16 border-t-2 border-secondary">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <p className="text-xl font-semibold">IIITD Resource Hub</p>
              <p className="text-muted-foreground">
                Find PYQs, Quizes, Tutorials and Notes across IIITD.
              </p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

