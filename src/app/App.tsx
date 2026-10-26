import AppLayout from "@cloudscape-design/components/app-layout";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Spinner from "@cloudscape-design/components/spinner";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { Mode } from "@cloudscape-design/global-styles";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useMatches, type Params } from "react-router";
import { getConfig } from "./config";
import { useFollow } from "./navigation";
import { Notifications } from "./notifications";
import { initialMode, saveMode } from "./theme";

export interface RouteHandle {
  crumb?: string | ((params: Params) => string);
}

/** The shell every page renders in: top bar, side navigation, breadcrumbs and notifications. */
export default function App() {
  const follow = useFollow();
  const location = useLocation();
  const matches = useMatches();
  const [mode, setMode] = useState(initialMode);

  useEffect(() => saveMode(mode), [mode]);

  const crumbs = matches.flatMap((match) => {
    const crumb = (match.handle as RouteHandle | undefined)?.crumb;
    if (!crumb) return [];
    return [{ text: typeof crumb === "function" ? crumb(match.params) : crumb, href: match.pathname }];
  });

  return (
    <>
      <div id="top-nav" style={{ position: "sticky", top: 0, zIndex: 1002 }}>
        <TopNavigation
          // No logo: with one, Cloudscape lets the title shrink to nothing next to the utilities.
          identity={{ href: "/", title: "JonomaIT Template", onFollow: follow }}
          utilities={[
            { type: "button", text: getConfig().environment, iconName: "settings", ariaLabel: "Ambiente" },
            {
              type: "button",
              text: mode === Mode.Dark ? "Tema claro" : "Tema escuro",
              onClick: () => setMode(mode === Mode.Dark ? Mode.Light : Mode.Dark),
            },
          ]}
        />
      </div>
      <AppLayout
        headerSelector="#top-nav"
        toolsHide
        navigation={
          <SideNavigation
            header={{ href: "/", text: "Template web" }}
            activeHref={location.pathname.startsWith("/itens") ? "/itens" : "/"}
            onFollow={follow}
            items={[
              { type: "link", text: "Comece aqui", href: "/" },
              { type: "link", text: "Itens (exemplo)", href: "/itens" },
              { type: "divider" },
              {
                type: "link",
                text: "Cloudscape",
                href: "https://cloudscape.design/components/",
                external: true,
              },
            ]}
          />
        }
        notifications={<Notifications />}
        breadcrumbs={<BreadcrumbGroup items={crumbs} onFollow={follow} ariaLabel="Navegação estrutural" />}
        content={
          <Suspense fallback={<Spinner size="large" />}>
            <Outlet />
          </Suspense>
        }
      />
    </>
  );
}
