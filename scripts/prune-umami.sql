\set ON_ERROR_STOP on

DELETE FROM event_data AS data_row
WHERE data_row.website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND (
    data_row.created_at < now() - make_interval(days => :'retention_days'::integer)
    OR EXISTS (
      SELECT 1
      FROM website_event AS event_row
      WHERE event_row.event_id = data_row.website_event_id
        AND event_row.created_at < now() - make_interval(days => :'retention_days'::integer)
    )
  );

DELETE FROM revenue AS revenue_row
WHERE revenue_row.website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND (
    revenue_row.created_at < now() - make_interval(days => :'retention_days'::integer)
    OR EXISTS (
      SELECT 1
      FROM website_event AS event_row
      WHERE event_row.event_id = revenue_row.event_id
        AND event_row.created_at < now() - make_interval(days => :'retention_days'::integer)
    )
  );

DELETE FROM session_data
WHERE website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND created_at < now() - make_interval(days => :'retention_days'::integer);

DELETE FROM heatmap_event
WHERE website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND created_at < now() - make_interval(days => :'retention_days'::integer);

DELETE FROM session_replay
WHERE website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND created_at < now() - make_interval(days => :'retention_days'::integer);

DELETE FROM session_replay_saved
WHERE website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND created_at < now() - make_interval(days => :'retention_days'::integer);

DELETE FROM website_event
WHERE website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND created_at < now() - make_interval(days => :'retention_days'::integer);

DELETE FROM session AS session_row
WHERE session_row.website_id = '4f1d3158-8b29-4380-9852-e6ba8069c881'
  AND session_row.created_at < now() - make_interval(days => :'retention_days'::integer)
  AND NOT EXISTS (
    SELECT 1 FROM website_event
    WHERE website_event.session_id = session_row.session_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM session_data
    WHERE session_data.session_id = session_row.session_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM revenue
    WHERE revenue.session_id = session_row.session_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM heatmap_event
    WHERE heatmap_event.session_id = session_row.session_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM session_replay
    WHERE session_replay.session_id = session_row.session_id
  );
