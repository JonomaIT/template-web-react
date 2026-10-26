import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import type { ReactNode } from "react";

/** What a table or list shows when it has nothing: a title, one line and, if useful, an action. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Box textAlign="center" color="inherit" padding={{ vertical: "l" }}>
      <SpaceBetween size="xs">
        <Box variant="strong" color="inherit">
          {title}
        </Box>
        {children && <Box color="inherit">{children}</Box>}
        {action}
      </SpaceBetween>
    </Box>
  );
}
