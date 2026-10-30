CREATE TABLE "playlist_flow_nodes" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "playlist_id" TEXT NOT NULL,
  "playlist_item_id" TEXT UNIQUE,
  "kind" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "connection_type" TEXT,
  "port" TEXT,
  "operator" TEXT,
  "expected_value" JSONB,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "playlist_flow_nodes_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE,
  CONSTRAINT "playlist_flow_nodes_playlist_item_id_fkey" FOREIGN KEY ("playlist_item_id") REFERENCES "playlist_items"("id") ON DELETE CASCADE
);
CREATE INDEX "playlist_flow_nodes_playlist_id_idx" ON "playlist_flow_nodes"("playlist_id");
CREATE TABLE "playlist_flow_edges" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "playlist_id" TEXT NOT NULL,
  "source_node_id" TEXT NOT NULL UNIQUE,
  "target_node_id" TEXT NOT NULL,
  "cooldown_ms" INTEGER NOT NULL DEFAULT 2000,
  "debounce_ms" INTEGER NOT NULL DEFAULT 100,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "playlist_flow_edges_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE,
  CONSTRAINT "playlist_flow_edges_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "playlist_flow_nodes"("id") ON DELETE CASCADE,
  CONSTRAINT "playlist_flow_edges_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "playlist_flow_nodes"("id") ON DELETE CASCADE
);
CREATE INDEX "playlist_flow_edges_playlist_id_idx" ON "playlist_flow_edges"("playlist_id");
CREATE INDEX "playlist_flow_edges_target_node_id_idx" ON "playlist_flow_edges"("target_node_id");
