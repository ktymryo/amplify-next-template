import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

const backend = defineBackend({
  auth,
  data,
});

// Enable unauthenticated access for Identity Pool
backend.auth.resources.unauthenticatedUserIamRole;
