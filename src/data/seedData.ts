import { UserProfile, SyllabusItem, Course, NoteArtifact, StudyTask, TopicMastery, RewardItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_chennai_cse_01',
  name: 'Arun Siddharth',
  email: 'arun.cse@annauniv.edu.in',
  institution: 'Anna University, CEG Campus, Chennai',
  degree: 'B.E. Computer Science & Engineering',
  semester: '5th Semester',
  branch: 'Computer Science and Engineering',
  targetGoal: 'Campus Placement Prep (Tier-1 Product Companies) & University Exams',
  availableHoursDaily: 3,
  learningStyle: 'visual',
  examDates: [
    { subject: 'Data Structures & Algorithms', date: '2026-09-15', daysLeft: 20 },
    { subject: 'Database Management Systems', date: '2026-09-19', daysLeft: 24 },
    { subject: 'Computer Networks', date: '2026-09-24', daysLeft: 29 },
  ],
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  points: 480,
  level: 3,
  enrolledCourseIds: ['course_dsa_01', 'course_dbms_01', 'course_java_spring_01'],
};

export const INITIAL_SYLLABUS: SyllabusItem[] = [
  {
    id: 'syl_dsa',
    subject: 'Data Structures and Algorithms (CS8391)',
    code: 'CS8391',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Linear Data Structures - Arrays & Linked Lists',
        topics: [
          {
            id: 'dsa_arr',
            title: 'Dynamic Arrays & Sliding Window',
            subtopics: ['Prefix Sum', 'Two Pointers', 'Kadane Algorithm', 'Dutch National Flag'],
            mastery: 92,
            prerequisites: ['Basic C++/Java Arrays'],
            importance: 'High',
          },
          {
            id: 'dsa_ll',
            title: 'Singly & Doubly Linked Lists',
            subtopics: ['Cycle Detection (Floyd)', 'Reverse in K-groups', 'LRU Cache Design'],
            mastery: 84,
            prerequisites: ['Pointers & Dynamic Memory'],
            importance: 'High',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Non-Linear Structures - Trees & Self-Balancing Trees',
        topics: [
          {
            id: 'dsa_trees',
            title: 'Binary Trees & Traversals',
            subtopics: ['Inorder/Preorder/Postorder', 'Level Order BFS', 'LCA', 'Diameter'],
            mastery: 65,
            prerequisites: ['Recursion'],
            importance: 'High',
          },
          {
            id: 'dsa_bst',
            title: 'Binary Search Trees (BST)',
            subtopics: ['BST Property', 'Search/Insert/Delete', 'Inorder Successor', 'Validate BST'],
            mastery: 58,
            prerequisites: ['Binary Trees'],
            importance: 'High',
          },
          {
            id: 'dsa_avl',
            title: 'AVL Trees & Balance Factor Rotations',
            subtopics: ['LL/RR/LR/RL Rotations', 'Rebalancing After Insert/Delete', 'Height Analysis'],
            mastery: 32, // WEAK TOPIC
            prerequisites: ['Binary Search Trees', 'Tree Rotations'],
            importance: 'High',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Graph Theory & Algorithms',
        topics: [
          {
            id: 'dsa_graph_traversal',
            title: 'Graph Representation & BFS/DFS',
            subtopics: ['Adjacency List', 'Bipartite Check', 'Cycle Detection in Directed Graphs'],
            mastery: 45,
            prerequisites: ['Queue', 'Recursion'],
            importance: 'High',
          },
          {
            id: 'dsa_shortest_path',
            title: 'Dijkstra & Bellman-Ford Shortest Path',
            subtopics: ['Priority Queue Dijkstra', 'Negative Cycle Detection', 'Floyd Warshall'],
            mastery: 28,
            prerequisites: ['Graph Traversal', 'Priority Queues'],
            importance: 'High',
          },
        ],
      },
    ],
  },
  {
    id: 'syl_dbms',
    subject: 'Database Management Systems (CS8492)',
    code: 'CS8492',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Relational Model & SQL',
        topics: [
          {
            id: 'dbms_sql',
            title: 'Complex SQL Queries & Joins',
            subtopics: ['INNER/LEFT/FULL Joins', 'Subqueries', 'Aggregate Functions', 'Window Functions'],
            mastery: 88,
            prerequisites: ['Relational Algebra'],
            importance: 'High',
          },
        ],
      },
      {
        unitNumber: 2,
        unitTitle: 'Database Design & Normalization',
        topics: [
          {
            id: 'dbms_norm',
            title: 'Functional Dependencies & Normal Forms (1NF to BCNF)',
            subtopics: ['Closure of Attribute Set', 'Candidate Keys', '3NF vs BCNF Decomposition', 'Lossless Join'],
            mastery: 38, // WEAK TOPIC
            prerequisites: ['Relational Schema', 'Super Keys'],
            importance: 'High',
          },
        ],
      },
      {
        unitNumber: 3,
        unitTitle: 'Transactions & Concurrency Control',
        topics: [
          {
            id: 'dbms_tx',
            title: 'ACID Properties & 2-Phase Locking (2PL)',
            subtopics: ['Conflict Serializability', 'Strict 2PL', 'Deadlock Detection & Prevention'],
            mastery: 60,
            prerequisites: ['Transaction Lifecycle'],
            importance: 'Medium',
          },
        ],
      },
    ],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_dsa_01',
    title: 'Mastering Data Structures & Algorithms for SDE Placements',
    code: 'DSA-PRO',
    category: 'Computer Science Core',
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc13c73335c?w=600&auto=format&fit=crop&q=80',
    instructor: 'Prof. Ramesh Natarajan & AI Adaptive Engine',
    rating: 4.9,
    studentsCount: 3420,
    duration: '45 Hours • 12 Units',
    level: 'Intermediate',
    description: 'Comprehensive placement-ready curriculum with interactive visualization, LeetCode style problems, and dynamic syllabus mapping.',
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Advanced Linear Structures & Two-Pointer Patterns',
        duration: '6 hrs',
        lessons: [
          { id: 'les_1', title: 'Dynamic Array Allocation & Amortized Complexity', duration: '25 min', completed: true, contentType: 'video', summary: 'Understanding O(1) amortized growth factor and memory layout.' },
          { id: 'les_2', title: 'Two Pointers & Sliding Window Masterclass', duration: '40 min', completed: true, contentType: 'article', summary: 'Optimal techniques for substring and subarray problems.' },
          { id: 'les_3', title: 'Floyd Cycle Finding in Linked Lists', duration: '30 min', completed: true, contentType: 'quiz', summary: 'Fast & slow pointer proof and cycle start point algorithm.' },
        ],
      },
      {
        id: 'mod_2',
        title: 'Module 2: Self-Balancing Trees & AVL Rotations (Adaptive Focus)',
        duration: '8 hrs',
        lessons: [
          { id: 'les_4', title: 'Binary Search Tree Limitations & Worst Case O(N)', duration: '20 min', completed: true, contentType: 'video', summary: 'Why skewed BSTs degrade to linked lists.' },
          { id: 'les_5', title: 'AVL Balance Factor & Left/Right Rotations', duration: '45 min', completed: false, contentType: 'article', summary: 'Deep dive on maintaining |hL - hR| <= 1 with single and double rotations.' },
          { id: 'les_6', title: 'AVL Tree Deletion & Rebalancing Assessment', duration: '35 min', completed: false, contentType: 'quiz', summary: 'Handling tricky double rotations after node deletion.' },
        ],
      },
      {
        id: 'mod_3',
        title: 'Module 3: Graph Traversal & Shortest Path Algorithms',
        duration: '10 hrs',
        lessons: [
          { id: 'les_7', title: 'BFS vs DFS with Cycle Detection', duration: '40 min', completed: false, contentType: 'video', summary: 'Color coding 3-state DFS for directed cycle detection.' },
          { id: 'les_8', title: 'Dijkstra Shortest Path with Min-Heap', duration: '50 min', completed: false, contentType: 'article', summary: 'Greedy relaxation of weighted edges and O((V+E) log V) complexity.' },
        ],
      },
    ],
  },
  {
    id: 'course_dbms_01',
    title: 'Enterprise DBMS, SQL Optimization & System Architecture',
    code: 'DBMS-CORE',
    category: 'Databases & Backend',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    instructor: 'Dr. Meenakshi Sundaram',
    rating: 4.8,
    studentsCount: 2890,
    duration: '38 Hours • 8 Units',
    level: 'Intermediate',
    description: 'Master relational schema design, 3NF/BCNF normalization proofs, query plans, indexing (B+ Trees), and transactional ACID concurrency.',
    modules: [
      {
        id: 'dbmod_1',
        title: 'Module 1: Relational Schema Design & SQL Mastery',
        duration: '7 hrs',
        lessons: [
          { id: 'dbles_1', title: 'Relational Algebra to SQL Translation', duration: '35 min', completed: true, contentType: 'video', summary: 'Selections, projections, cross products, and theta joins.' },
          { id: 'dbles_2', title: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK', duration: '40 min', completed: true, contentType: 'article', summary: 'Analytical SQL queries over partitioned partitions.' },
        ],
      },
      {
        id: 'dbmod_2',
        title: 'Module 2: Functional Dependencies & Normal Forms (1NF to BCNF)',
        duration: '9 hrs',
        lessons: [
          { id: 'dbles_3', title: 'Finding Candidate Keys via Attribute Closure', duration: '30 min', completed: false, contentType: 'article', summary: 'Algorithm to compute X+ and identify minimal superkeys.' },
          { id: 'dbles_4', title: '3NF vs BCNF: Lossless Join & Dependency Preservation', duration: '45 min', completed: false, contentType: 'video', summary: 'Why BCNF does not always preserve functional dependencies.' },
        ],
      },
    ],
  },
  {
    id: 'course_java_spring_01',
    title: 'Java 17 Backend Engineering with Spring Boot & Microservices',
    code: 'JAVA-SPRING',
    category: 'Full-Stack & Systems',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    instructor: 'Karthik Raja (Principal Architect)',
    rating: 4.95,
    studentsCount: 4120,
    duration: '52 Hours • 14 Units',
    level: 'Advanced',
    description: 'Build enterprise-grade RESTful APIs, JPA/Hibernate mappings, Spring Security with JWT, and event-driven architectures with Kafka.',
    modules: [
      {
        id: 'javamod_1',
        title: 'Module 1: Spring Boot Core & Dependency Injection',
        duration: '8 hrs',
        lessons: [
          { id: 'javales_1', title: 'IoC Container, @Component and @Bean Lifecycle', duration: '35 min', completed: true, contentType: 'video', summary: 'Understanding inversion of control and bean scopes.' },
          { id: 'javales_2', title: 'Building Clean REST Controllers & Validation', duration: '45 min', completed: true, contentType: 'article', summary: 'Standard DTOs, @Valid annotations, and GlobalExceptionHandler.' },
        ],
      },
    ],
  },
  {
    id: 'course_cn_01',
    title: 'Computer Networks & Distributed Protocols',
    code: 'CN-ENG',
    category: 'Computer Science Core',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    instructor: 'Prof. S. Balaji',
    rating: 4.7,
    studentsCount: 1950,
    duration: '32 Hours • 6 Units',
    level: 'Intermediate',
    description: 'Deep dive into TCP/IP protocol stack, congestion control (Reno, Cubic), subnetting CIDR, DNS resolution, and HTTP/3 QUIC.',
    modules: [
      {
        id: 'cnmod_1',
        title: 'Module 1: Transport Layer & TCP Congestion Control',
        duration: '6 hrs',
        lessons: [
          { id: 'cnles_1', title: 'TCP 3-Way Handshake and 4-Way Teardown', duration: '30 min', completed: false, contentType: 'video', summary: 'SYN, ACK packets and TIME_WAIT socket states.' },
        ],
      },
    ],
  },
];

export const INITIAL_NOTE_ARTIFACTS: NoteArtifact[] = [
  {
    id: 'note_avl_unit2',
    title: 'Unit 2 - AVL Trees, Balance Factors & Rotation Proofs',
    subject: 'Data Structures & Algorithms',
    sourceType: 'pdf',
    createdAt: '2026-08-25',
    rawContent: `AVL tree is a self-balancing binary search tree. In an AVL tree, the heights of the two child subtrees of any node differ by at most one.
If at any time they differ by more than one, rebalancing is done to restore this property.
Balance Factor = Height(Left Subtree) - Height(Right Subtree)
Balance Factor allowed values: -1, 0, +1.
When Balance Factor becomes +2 or -2, we perform rotations:
1. LL Rotation: Node inserted into Left subtree of Left child. Fix: Single Right Rotation at unbalanced node.
2. RR Rotation: Node inserted into Right subtree of Right child. Fix: Single Left Rotation at unbalanced node.
3. LR Rotation: Node inserted into Right subtree of Left child. Fix: Left rotation on Left child, followed by Right rotation on unbalanced node.
4. RL Rotation: Node inserted into Left subtree of Right child. Fix: Right rotation on Right child, followed by Left rotation on unbalanced node.
Time Complexity: Search: O(log N), Insert: O(log N), Delete: O(log N). Space Complexity: O(N).`,
    easyNotes: `# AVL Trees Explained Simply

An **AVL Tree** is an intelligent Binary Search Tree (BST) that refuses to become slow. 

### Why do we need it?
If you insert numbers in sorted order into a regular BST (like 10, 20, 30, 40), it becomes a straight line (a linked list), slowing down searches from **O(log N)** to a sluggish **O(N)**. AVL trees solve this by auto-balancing after every single insert or delete!

### The Balance Factor (BF)
Every node computes:
$$\\text{Balance Factor} = \\text{Height(Left Subtree)} - \\text{Height(Right Subtree)}$$
* Healthy nodes have a Balance Factor of **-1, 0, or +1**.
* If a node hits **+2 or -2**, it is "unbalanced" and triggers a rotation.

### The 4 Magic Rotations:
1. **Left-Left (LL) Case** → Fix with **1 Right Rotation**
2. **Right-Right (RR) Case** → Fix with **1 Left Rotation**
3. **Left-Right (LR) Case** → Double rotation: **Left Rotate Child**, then **Right Rotate Parent**
4. **Right-Left (RL) Case** → Double rotation: **Right Rotate Child**, then **Left Rotate Parent**`,
    mindMap: {
      id: 'root_avl',
      label: 'AVL Trees (Self-Balancing BST)',
      color: '#4f46e5',
      children: [
        {
          id: 'avl_prop',
          label: 'Core Properties',
          color: '#06b6d4',
          children: [
            { id: 'avl_bf', label: 'Balance Factor: |hL - hR| ≤ 1' },
            { id: 'avl_tc', label: 'Search/Insert/Delete: O(log N)' },
            { id: 'avl_h', label: 'Strict Max Height: 1.44 log₂(N)' },
          ],
        },
        {
          id: 'avl_rot',
          label: '4 Rebalancing Rotations',
          color: '#e11d48',
          children: [
            {
              id: 'avl_single',
              label: 'Single Rotations',
              children: [
                { id: 'avl_ll', label: 'LL Imbalance → Single Right Rotation' },
                { id: 'avl_rr', label: 'RR Imbalance → Single Left Rotation' },
              ],
            },
            {
              id: 'avl_double',
              label: 'Double Rotations',
              children: [
                { id: 'avl_lr', label: 'LR Imbalance → Left on Child, Right on Node' },
                { id: 'avl_rl', label: 'RL Imbalance → Right on Child, Left on Node' },
              ],
            },
          ],
        },
        {
          id: 'avl_prereq',
          label: 'Required Prerequisites',
          color: '#10b981',
          children: [
            { id: 'pr_bst', label: 'BST Property (Left < Root < Right)' },
            { id: 'pr_rot', label: 'Pointer Re-linking during Tree Rotation' },
            { id: 'pr_rec', label: 'Recursive Height Calculation' },
          ],
        },
      ],
    },
    flashcards: [
      {
        id: 'fc_1',
        question: 'What are the permissible Balance Factor values for a valid AVL tree node?',
        answer: '-1, 0, and +1. Any node with BF of +2 or -2 is deemed unbalanced and requires rotation.',
        category: 'Definitions',
        mastered: true,
      },
      {
        id: 'fc_2',
        question: 'How do you fix a Left-Right (LR) imbalance at node A?',
        answer: 'Perform a Left Rotation on node A’s left child (B), then perform a Right Rotation on node A itself.',
        category: 'Rotations',
        mastered: false,
      },
      {
        id: 'fc_3',
        question: 'What is the worst-case search time complexity in an AVL tree with N nodes?',
        answer: 'O(log N) because the height is mathematically bounded by approximately 1.44 * log2(N).',
        category: 'Complexity Analysis',
        mastered: true,
      },
      {
        id: 'fc_4',
        question: 'Why is AVL tree preferred over Red-Black tree for lookup-heavy workloads?',
        answer: 'AVL trees are more strictly balanced than Red-Black trees, leading to shorter average path lengths and faster search operations.',
        category: 'System Tradeoffs',
        mastered: false,
      },
    ],
    quiz: [
      {
        id: 'q_avl_1',
        question: 'A node has a Left Subtree of height 4 and a Right Subtree of height 2. What is its balance factor and state?',
        options: [
          'Balance Factor = +2, Node is Unbalanced (Left-Heavy)',
          'Balance Factor = -2, Node is Balanced',
          'Balance Factor = +1, Node is Balanced',
          'Balance Factor = +6, Tree is invalid',
        ],
        correctIndex: 0,
        explanation: 'Balance factor is Height(Left) - Height(Right) = 4 - 2 = +2. Since |BF| > 1, the node violates AVL properties and is Left-Heavy.',
        topicTag: 'Balance Factor Calculation',
        difficulty: 'Easy',
      },
      {
        id: 'q_avl_2',
        question: 'When inserting key 15 into a subtree rooted at 30, with left child 20 and right child of 20 being 25 (LR case), which rotation sequence restores balance?',
        options: [
          'Single Right Rotation on 30',
          'Left Rotation on 20, followed by Right Rotation on 30',
          'Right Rotation on 20, followed by Left Rotation on 30',
          'Single Left Rotation on 30',
        ],
        correctIndex: 1,
        explanation: 'In an LR imbalance, the inserted node is in the right subtree of the left child. We first rotate Left at the child (20) to convert it to an LL case, then rotate Right at the root (30).',
        topicTag: 'Double Rotations',
        difficulty: 'Medium',
      },
      {
        id: 'q_avl_3',
        question: 'What is the maximum number of rotations needed to restore balance after a SINGLE deletion in an AVL tree?',
        options: [
          'At most 1 rotation',
          'At most 2 rotations',
          'O(log N) rotations along the path to the root',
          'O(N) rotations across the entire tree',
        ],
        correctIndex: 2,
        explanation: 'Unlike insertion which requires at most 2 rotations (1 double rotation), deletion in an AVL tree can cause a cascade of imbalances requiring O(log N) rotations up to the root.',
        topicTag: 'Deletion Rebalancing',
        difficulty: 'Hard',
      },
    ],
    quickRevision: [
      'Balance Factor (BF) = Height(Left) - Height(Right). Valid set: {-1, 0, 1}.',
      'LL violation → 1 Right Rotation.',
      'RR violation → 1 Left Rotation.',
      'LR violation → Left Rotate Child + Right Rotate Parent.',
      'RL violation → Right Rotate Child + Left Rotate Parent.',
      'Strict logarithmic search guarantee O(log N); ideal for read-intensive databases.',
    ],
    importantPoints: [
      'Adelson-Velsky and Landis invented the first self-balancing BST in 1962.',
      'Max Height h < 1.44 log₂(N + 2) - 0.328.',
      'Insertion rebalancing terminates after at most 1 single or double rotation.',
      'Deletion rebalancing may propagate up to the root (O(log N) rotations).',
    ],
  },
  {
    id: 'note_dbms_norm',
    title: 'Unit 3 - Normalization: 1NF, 2NF, 3NF and BCNF with Lossless Joins',
    subject: 'Database Management Systems',
    sourceType: 'text',
    createdAt: '2026-08-24',
    rawContent: `Normalization is the process of organizing relational database tables to reduce data redundancy and eliminate anomalies (Insertion, Deletion, Update anomalies).
1NF: All attribute values must be atomic (no multi-valued or composite attributes).
2NF: In 1NF and no Partial Dependency exists (No non-prime attribute should depend on a proper subset of any candidate key).
3NF: In 2NF and no Transitive Dependency exists (For any functional dependency X -> Y, either X is a superkey OR Y is a prime attribute).
BCNF (Boyce-Codd Normal Form): Strict 3NF. For every functional dependency X -> Y, X MUST be a superkey.
Key Tradeoff: 3NF guarantees both Lossless Join and Dependency Preservation. BCNF guarantees Lossless Join but may NOT always preserve all functional dependencies.`,
    easyNotes: `# Database Normalization Made Crystal Clear

Think of **Normalization** as decluttering a messy closet so you never have duplicate copies of socks or lose clothes when throwing out a hanger!

### The 3 Big Database Headaches (Anomalies)
1. **Insertion Anomaly:** Cannot record a new student until they enroll in at least one course.
2. **Deletion Anomaly:** Deleting the only student in a course accidentally deletes the entire course information.
3. **Update Anomaly:** Updating a teacher's phone number requires modifying 500 student rows.

### The Ladder of Normal Forms:
* **1NF:** *No arrays or lists in columns.* Every cell has exactly one atomic value.
* **2NF:** *No half-baked dependencies.* Non-key columns must depend on the FULL composite primary key, not just half of it.
* **3NF:** *No gossip chains (transitivity).* If A determines B, and B determines C, C must not lean on A through B unless B is a key or C is prime!
* **BCNF:** *The ultimate test.* In **X → Y**, the determinant **X MUST ALWAYS be a Super Key**. No exceptions.`,
    mindMap: {
      id: 'root_norm',
      label: 'Database Normalization',
      color: '#0284c7',
      children: [
        {
          id: 'norm_levels',
          label: 'Normal Forms Ladder',
          children: [
            { id: 'nf_1', label: '1NF: Atomic Columns (No multi-values)' },
            { id: 'nf_2', label: '2NF: 1NF + Eliminate Partial Dependencies' },
            { id: 'nf_3', label: '3NF: 2NF + Eliminate Transitive Dependencies' },
            { id: 'nf_bcnf', label: 'BCNF: Strict rule (Determinant X is Super Key)' },
          ],
        },
        {
          id: 'norm_tradeoff',
          label: 'Decomposition Properties',
          children: [
            { id: 'dc_lossless', label: 'Lossless Join (Mandatory to avoid phantom rows)' },
            { id: 'dc_dep', label: 'Dependency Preservation (Guaranteed in 3NF, not in BCNF)' },
          ],
        },
      ],
    },
    flashcards: [
      {
        id: 'fc_norm_1',
        question: 'What is the exact definition of Boyce-Codd Normal Form (BCNF)?',
        answer: 'A relation R is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey of R.',
        category: 'Definitions',
        mastered: false,
      },
      {
        id: 'fc_norm_2',
        question: 'What is the difference between 3NF and BCNF?',
        answer: 'In 3NF, if X -> Y, Y can be a prime attribute even if X is not a superkey. In BCNF, X MUST be a superkey regardless of what Y is.',
        category: 'Comparison',
        mastered: true,
      },
    ],
    quiz: [
      {
        id: 'q_norm_1',
        question: 'Given relation R(A, B, C, D) with FDs: {AB -> C, C -> D, D -> A}. What is the highest normal form of R?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctIndex: 2,
        explanation: 'Candidate keys are AB, BC, BD. In C -> D, C is not a superkey, but D is a prime attribute (part of candidate key BD). Thus it satisfies 3NF, but violates BCNF.',
        topicTag: 'Normal Form Determination',
        difficulty: 'Hard',
      },
    ],
    quickRevision: [
      '1NF: Atomic values only.',
      '2NF: No partial dependency on composite key.',
      '3NF: For X -> Y, X is Super Key OR Y is Prime Attribute.',
      'BCNF: For X -> Y, X MUST be a Super Key.',
      '3NF preserves dependencies; BCNF may sacrifice dependency preservation.',
    ],
    importantPoints: [
      'Anomalies avoided: Insertion, Deletion, and Update anomalies.',
      'Candidate keys are minimal superkeys with no redundant attributes.',
      'Lossless join decomposition test: R1 ∩ R2 -> (R1 - R2) or R1 ∩ R2 -> (R2 - R1).',
    ],
  },
];

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'Adaptive Remediation: Revise Binary Search Tree (BST) Properties',
    subject: 'Data Structures & Algorithms',
    topic: 'Binary Search Trees',
    date: '2026-08-27',
    timeSlot: '05:30 PM - 06:15 PM',
    durationMinutes: 45,
    completed: false,
    priority: 'Urgent',
    source: 'weak_topic_remedy',
    reason: 'Prerequisite gap detected: Scoring <40% on AVL Trees requires strengthening BST foundation first.',
  },
  {
    id: 'task_2',
    title: 'Interactive Practice: Tree Rotation Mechanics (LL, RR, LR, RL)',
    subject: 'Data Structures & Algorithms',
    topic: 'AVL Trees & Rotations',
    date: '2026-08-27',
    timeSlot: '06:30 PM - 07:15 PM',
    durationMinutes: 45,
    completed: false,
    priority: 'High',
    source: 'syllabus',
    noteId: 'note_avl_unit2',
  },
  {
    id: 'task_3',
    title: 'Review Personal Upload: DBMS Normalization 3NF vs BCNF Notes',
    subject: 'Database Management Systems',
    topic: 'Normalization (3NF / BCNF)',
    date: '2026-08-27',
    timeSlot: '08:30 PM - 09:15 PM',
    durationMinutes: 45,
    completed: false,
    priority: 'Normal',
    source: 'personal_note',
    noteId: 'note_dbms_norm',
  },
  {
    id: 'task_4',
    title: 'Complete SDE Placement Quiz: Two Pointers & Sliding Window',
    subject: 'Data Structures & Algorithms',
    topic: 'Arrays & Two Pointers',
    date: '2026-08-28',
    timeSlot: '06:00 PM - 06:45 PM',
    durationMinutes: 45,
    completed: false,
    priority: 'High',
    source: 'course',
  },
];

export const INITIAL_TOPIC_MASTERY: TopicMastery[] = [
  {
    topic: 'Dynamic Arrays & Two Pointers',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 92,
    status: 'Mastered',
    prerequisites: ['Basic Arrays'],
    recommendedAction: 'Ready for Hard LeetCode practice and mock interviews.',
    lastPracticed: 'Yesterday',
  },
  {
    topic: 'Linked Lists & Cycle Detection',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 84,
    status: 'Mastered',
    prerequisites: ['Pointers'],
    recommendedAction: 'Solid mastery! Maintain streak with periodic flashcard review.',
    lastPracticed: '2 days ago',
  },
  {
    topic: 'Binary Trees & Traversals',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 65,
    status: 'In Progress',
    prerequisites: ['Recursion'],
    recommendedAction: 'Review Level-Order BFS and Lowest Common Ancestor.',
    lastPracticed: '3 days ago',
  },
  {
    topic: 'Binary Search Trees (BST)',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 58,
    status: 'Needs Attention',
    prerequisites: ['Binary Trees'],
    recommendedAction: 'Prerequisite for AVL Trees. Practice BST deletion and successor search.',
    lastPracticed: '4 days ago',
  },
  {
    topic: 'AVL Trees & Self-Balancing Rotations',
    subject: 'Data Structures & Algorithms',
    masteryPercentage: 32,
    status: 'Critical Prerequisite Gap',
    prerequisites: ['Binary Search Trees', 'Tree Rotations'],
    recommendedAction: 'Adaptive Trigger: Revise BST fundamentals, then practice 4 rotation steps.',
    lastPracticed: 'Today',
  },
  {
    topic: 'DBMS Complex SQL Joins & Subqueries',
    subject: 'Database Management Systems',
    masteryPercentage: 88,
    status: 'Mastered',
    prerequisites: ['Relational Model'],
    recommendedAction: 'Strong mastery. Focus next on Window Functions.',
    lastPracticed: '3 days ago',
  },
  {
    topic: 'Functional Dependencies & Normal Forms (3NF/BCNF)',
    subject: 'Database Management Systems',
    masteryPercentage: 38,
    status: 'Critical Prerequisite Gap',
    prerequisites: ['Attribute Closure', 'Super Keys'],
    recommendedAction: 'Adaptive Trigger: Practice Candidate Key computation via attribute closure algorithm.',
    lastPracticed: 'Yesterday',
  },
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew_streak_7',
    title: '7-Day Consistent Scholar Badge',
    type: 'badge',
    pointsCost: 350,
    unlocked: true,
    icon: 'Flame',
    description: 'Awarded for maintaining 7 consecutive days of active syllabus learning sessions.',
    category: 'Digital Badge',
  },
  {
    id: 'rew_dsacheat',
    title: 'Tier-1 SDE Placement Revision Pack',
    type: 'resource',
    pointsCost: 400,
    unlocked: true,
    icon: 'FileText',
    description: 'High-yield hand-curated formula sheet & quick revision cards for top product interviews.',
    category: 'Study Pack',
  },
  {
    id: 'rew_kit_welcome',
    title: 'AdaptiveAI Student Welcome Kit (Hackathon Tier)',
    type: 'physical_kit',
    pointsCost: 750,
    unlocked: false,
    icon: 'Package',
    description: 'Physical educational study package: Ergonomic laptop study bag, stainless water bottle, smart dot-grid notebook, pilot pen set, and laminated formula flashcards.',
    category: 'Physical Merch',
  },
  {
    id: 'rew_badge_mastery',
    title: 'Tree & Graph Algorithm Grandmaster',
    type: 'badge',
    pointsCost: 1000,
    unlocked: false,
    icon: 'Award',
    description: 'Unlocked upon achieving >85% topic mastery across all non-linear data structures.',
    category: 'Achievement',
  },
];
