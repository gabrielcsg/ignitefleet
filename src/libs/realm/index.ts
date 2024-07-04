import { createRealmContext } from '@realm/react';
import { Coords } from './schemas/Coords';
import { Historic } from './schemas/Historic';
import {
  OpenRealmBehaviorConfiguration,
  OpenRealmBehaviorType,
  SyncConfiguration,
} from 'realm';

const realmAccessBehavior: OpenRealmBehaviorConfiguration = {
  type: OpenRealmBehaviorType.OpenImmediately,
};

export const syncConfig: Partial<SyncConfiguration> = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
};

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({ schema: [Historic, Coords], schemaVersion: 0 });
