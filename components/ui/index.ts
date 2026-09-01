/**
 * REDS agent-portal UI primitives.
 *
 * Every card, overlay and control in the agent portal is built from these.
 * The contract they encode lives in docs/agent-card-system-plan.md §2; the
 * colour and type rules they draw on live in docs/reds-brand-book.md.
 *
 * Rules of thumb:
 *   - never hardcode a hex; use the --app-* tokens via these components
 *   - never use an arbitrary text size; the scale starts at 12px (text-caption)
 *   - green is a fill or a bar, never thin vivid green on a light surface
 *   - red and amber mean error and warning, never decoration
 */
export { Card, CardHeader, CardHeading, CardActions, CardBody, CardFooter } from "./card";
export type { CardProps, CardSize } from "./card";

export { Badge, StatusDot, ProgressBar, STATUS_TONE } from "./status";
export type { Tone, Status, BadgeProps } from "./status";

export { StatTile, StatGrid } from "./stat-tile";
export type { StatTileProps } from "./stat-tile";

export { TableCard, Th, Td, Tr } from "./table-card";
export {
  ChartCard,
  ChartLegendItem,
  CHART_SERIES,
  CHART_GRID,
  CHART_AXIS,
  CHART_DANGER,
  CHART_WARNING,
  chartAxisProps,
} from "./chart-card";

export { EmptyState } from "./empty-state";
export { Tabs, DataField } from "./tabs";
export { SectionHeader, PageShell } from "./section-header";

export { Modal } from "./modal";
export type { ModalSize } from "./modal";
export { Drawer } from "./drawer";

export {
  Skeleton,
  SkeletonRegion,
  SkeletonText,
  SkeletonCircle,
  SkeletonRows,
  SkeletonTable,
  SkeletonStatGrid,
  SkeletonCardGrid,
  SkeletonChart,
  PageSkeleton,
} from "./skeleton";

export { Button, IconButton } from "./button";
export type { ButtonProps, ButtonVariant } from "./button";

export {
  Toolbar,
  SearchInput,
  Select,
  SegmentedControl,
  FieldLabel,
  TextInput,
  Checkbox,
  Switch,
  Textarea,
} from "./toolbar";
