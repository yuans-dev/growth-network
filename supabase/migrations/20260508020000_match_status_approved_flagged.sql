-- Extend match_status enum to support advisor review workflow
-- pending  → AI generated, sits in advisor queue (invisible to members)
-- approved → Advisor greenlit it, both members notified and can respond
-- flagged  → Advisor needs more information before deciding
-- declined → Discarded (advisor rejected OR a member declined)
-- accepted → Both members responded yes, awaiting advisor intro
-- introduced → Advisor sent the warm introduction

ALTER TYPE public.match_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE public.match_status ADD VALUE IF NOT EXISTS 'flagged';
