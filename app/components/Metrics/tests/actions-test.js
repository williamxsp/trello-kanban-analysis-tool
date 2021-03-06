import { test } from 'tape';

import {
  setMoveActionLists,
  getDetailedMoveAction,
  consolidateSkippedLists,
  consolidateActions,
} from '../actions';

test('setMoveActionLists', (assert) => {
  const action = {
    data: {
      listAfter: { id: 'list-3' },
      listBefore: { id: 'list-0' },
    },
    type: 'updateCard',
  };
  const lists = ['list-1', 'list-2'];

  const expected = {
    data: {
      listAfter: { id: 'list-2' },
      listBefore: { id: 'list-1' },
    },
    type: 'updateCard',
  };

  assert.deepEqual(
    setMoveActionLists(action)(lists),
    expected,
    'should return the given action parsed with the given couple of list ids'
  );
  assert.end();
});

test('getDetailedMoveAction', (assert) => {
  const lists = ['list-0', 'list-1', 'list-2', 'list-3', 'list-4', 'list-5'];
  const action = {
    data: {
      listAfter: { id: 'list-4' },
      listBefore: { id: 'list-1' },
    },
    date: '2016-05-06T22:52:38.318Z',
    type: 'updateCard',
  };
  const expected = [
    {
      data: {
        listAfter: { id: 'list-4' },
        listBefore: { id: 'list-3' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-3' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-2' },
        listBefore: { id: 'list-1' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
  ];

  assert.deepEqual(
    getDetailedMoveAction(lists, action),
    expected,
    'should return a list of move actions going through all skipped lists'
  );
  assert.end();
});

test('consolidateSkippedLists', (assert) => {
  const actions = [
    {
      data: {
        listAfter: { id: 'list-4' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-3' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-04T22:00:10.318Z',
      type: 'updateCard',
    },
    {
      data: {
        card: { id: 'card-2' },
        old: { desc: '' },
      },
      date: '2016-05-04T10:00:10.310Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-2' },
        listBefore: { id: 'list-1' },
      },
      date: '2016-04-14T22:00:10.318Z',
      type: 'updateCard',
    },
    {
      data: {
        list: { id: 'list-1' },
        card: { id: 'card-2' },
      },
      date: '2016-04-08T08:16:10.499Z',
      type: 'createCard',
    },
    // Backward move actions are omitted from the output
    {
      data: {
        listAfter: { id: 'list-1' },
        listBefore: { id: 'list-3' },
      },
      date: '2016-03-06T22:52:38.318Z',
      type: 'updateCard',
    },
  ];
  const lists = [
    'list-1',
    'list-2',
    'list-3',
    'list-4',
  ];
  const expected = [
    {
      data: {
        listAfter: { id: 'list-4' },
        listBefore: { id: 'list-3' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-3' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-3' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-04T22:00:10.318Z',
      type: 'updateCard',
    },
    {
      data: {
        card: { id: 'card-2' },
        old: { desc: '' },
      },
      date: '2016-05-04T10:00:10.310Z',
      type: 'updateCard',
    },
    {
      data: {
        listAfter: { id: 'list-2' },
        listBefore: { id: 'list-1' },
      },
      date: '2016-04-14T22:00:10.318Z',
      type: 'updateCard',
    },
    {
      data: {
        list: { id: 'list-1' },
        card: { id: 'card-2' },
      },
      date: '2016-04-08T08:16:10.499Z',
      type: 'createCard',
    },
  ];

  assert.deepEqual(
    consolidateSkippedLists(lists)(actions),
    expected,
    'should return actions with decomposed cards move to prevent skipped lists'
  );
  assert.end();
});

test('Metrics#consolidateActions', (assert) => {
  const actions = [
    {
      id: '5725936511e835ed2cb67d0f',
      data: {
        listAfter: { id: 'list-4' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      id: '571795e339b2476854c24c5c',
      data: {
        listAfter: { id: 'list-2' },
        listBefore: { id: 'list-1' },
      },
      date: '2016-04-12T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      id: '5708281d30952a32ef38b9f2',
      date: '2016-04-10T15:15:41.992Z',
      type: 'updateCard',
    },
  ];
  const complementaryActions = [
    [
      {
        id: '570769ac75c9d0d7b8e92bf7',
        date: '2016-04-08T08:19:56.682Z',
        type: 'updateCard',
      },
      {
        id: '570768ca19fde6c4a98714b6',
        date: '2016-04-08T08:16:10.499Z',
        type: 'createCard',
      },
    ],
    [
      {
        id: '570688705fb6f00c3b677154',
        date: '2016-04-07T16:18:56.690Z',
        type: 'updateCard',
      },
    ],
  ];
  const lists = ['list-1', 'list-2', 'list-3', 'list-4', 'list-5'];
  const expected = [
    {
      id: '5725936511e835ed2cb67d0f',
      data: {
        listAfter: { id: 'list-4' },
        listBefore: { id: 'list-3' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      id: '5725936511e835ed2cb67d0f',
      data: {
        listAfter: { id: 'list-3' },
        listBefore: { id: 'list-2' },
      },
      date: '2016-05-06T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      id: '571795e339b2476854c24c5c',
      data: {
        listAfter: { id: 'list-2' },
        listBefore: { id: 'list-1' },
      },
      date: '2016-04-12T22:52:38.318Z',
      type: 'updateCard',
    },
    {
      id: '5708281d30952a32ef38b9f2',
      date: '2016-04-10T15:15:41.992Z',
      type: 'updateCard',
    },
    {
      id: '570769ac75c9d0d7b8e92bf7',
      date: '2016-04-08T08:19:56.682Z',
      type: 'updateCard',
    },
    {
      id: '570768ca19fde6c4a98714b6',
      date: '2016-04-08T08:16:10.499Z',
      type: 'createCard',
    },
    {
      id: '570688705fb6f00c3b677154',
      date: '2016-04-07T16:18:56.690Z',
      type: 'updateCard',
    },
  ];

  assert.deepEqual(
    consolidateActions(actions, complementaryActions, lists),
    expected,
    'should consolidate actions with complementary ones'
  );
  assert.end();
});
