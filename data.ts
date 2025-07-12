export interface Video {
  id: string | number
  title: string
  thumbnail: string
  description: string
  views: number | string
  uploader: string
  uploadDate: string
  likes: number | string
  comments: number | string
  url: string
  platform: string
  category: string
  duration?: string
  isShort?: boolean // Flag to indicate if video is a short format video
  watchDate?: string // Added for history tracking
}

export const videos: Video[] = [
  {
    id: "1262",
    title: "Lecture 1: Intro to Programming & Flowcharts",
    thumbnail:
      "https://i.ytimg.com/vi/WQoB2z67hvY/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDQDcsMp5vXtuDFHagbqO3xBeVIlQ",
    url: "https://www.youtube.com/embed/WQoB2z67hvY?si=3BAfpeI5p2LxxMZh",
    uploader: "PREETAM SINGH",
    views: 500,
    uploadDate: "1 day ago",
    description:
      "Learn the basics of arrays, including declaration, initialization, and common operations like insertion, deletion, and traversal.",
    platform: "YouTube", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: 10,
    comments: 2,
  },
  {
    id: "1",
    title: "05. Let's solve some Patterns [HD]",
    thumbnail: "https://i.postimg.cc/FFgwJSsS/ol-Ra6n-XPv-Qy-G5w4-T-generated-image.jpg",
    url: "https://drive.google.com/file/d/1v_jDZJHLmt0GTEIect-yy4IOytwwjR9D/preview",
    uploader: "PREETAM SINGH",
    views: 500,
    uploadDate: "1 day ago",
    description:
      "Learn the basics of arrays, including declaration, initialization, and common operations like insertion, deletion, and traversal.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: 10,
    comments: 2,
  },
  {
    id: "2",
    title: "06. Week-1 [Connect] [HD]",
    thumbnail: "https://i.postimg.cc/SxtBxpQt/06-image.jpg",
    url: "https://drive.google.com/file/d/1E-E8dclQdh1RWh1Lxe6_rMGvPJOgyV3n/preview",
    uploader: "PREETAM SINGH",
    views: 300,
    uploadDate: "2 days ago",
    description:
      "Understand the working of QuickSort and MergeSort algorithms with step-by-step examples and time complexity analysis.",
    platform: "Google Drive", // Corrected platform
    category: "Sorting Algorithms", // Corrected category (based on description)
    likes: 15,
    comments: 5,
  },
  {
    id: "3",
    title: "07. Flowcharts Q1",
    thumbnail: "https://i.postimg.cc/vTMjNYXD/ilh-kljikj-kj-gv-07-Flowcharts-Q1.jpg",
    url: "https://www.bitchute.com/embed/2lUbsw3pQlFc/",
    uploader: "PREETAM SINGH",
    views: 200,
    uploadDate: "3 days ago",
    description:
      "Master the Knapsack problem using dynamic programming, with detailed explanations and code implementation.",
    platform: "Bitchute", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: 20,
    comments: 10,
  },
  {
    id: "4",
    title: "08. Flowcharts Q2",
    thumbnail: "https://i.postimg.cc/25sgnFZQ/08-Flowcharts-Q2.jpg",
    url: "https://odysee.com/%24/embed/08.-Flowcharts-Q2%3A2?r=GZutQyR5EPnTE4CHQtHu8guBxTKkaBRv&autoplay=true",
    uploader: "PREETAM SINGH",
    views: 400,
    uploadDate: "4 days ago",
    description: "Explore Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms with practical examples.",
    platform: "Odysee", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "25",
    comments: "8",
  },
  {
    id: "5",
    title: "09. Flowcharts Q3",
    thumbnail: "https://i.postimg.cc/W4FQDfhp/09-Flowcharts-Q3.jpg",
    url: "https://drive.google.com/file/d/1taoAPCx45aI1KOiE1lUeMxc3yG6ZTl2E/preview",
    uploader: "Preetam Singh",
    views: "350",
    uploadDate: "5 days ago",
    description: "Learn about binary trees, tree traversals (in-order, pre-order, post-order), and their applications.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "18",
    comments: "6",
  },
  {
    id: "6",
    title: "10. Flowcharts Q4",
    thumbnail: "https://i.postimg.cc/rm53j01v/10.jpg",
    url: "https://drive.google.com/file/d/15Z2wbyYuHTksey6AUv6aYZMOJP5EIoKS/preview",
    uploader: "Preetam Singh",
    views: "450",
    uploadDate: "6 days ago",
    description: "Understand hashing, hash functions, and how hash tables work in data structures.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "22",
    comments: "7",
  },
  {
    id: "7",
    title: "11. Flowcharts Q5",
    thumbnail: "https://i.postimg.cc/j2X9Vpkc/Flowcharts-Q5.jpg",
    url: "https://drive.google.com/file/d/13DXJ8ZfKsf6nOo2I-i_EuBYSTKpMPC2E/preview",
    uploader: "Preetam Singh",
    views: "500",
    uploadDate: "7 days ago",
    description:
      "Dive into AVL trees, a self-balancing binary search tree, with insertion, deletion, and rotation examples.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "30",
    comments: "12",
  },
  {
    id: "8",
    title: "12. Flowcharts Q6",
    thumbnail: "https://i.postimg.cc/QC4bJhy2/Kp31ha3-Nfr4-LYQni-generated-image-1.jpg",
    url: "https://drive.google.com/file/d/1S0nEvliEHHXAS6To6TUkHYx9_duuh9-A/preview",
    uploader: "Preetam Singh",
    views: "600",
    uploadDate: "8 days ago",
    description: "Master recursion and backtracking techniques with real-world examples like the N-Queens problem.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "35",
    comments: "15",
  },
  {
    id: "9",
    title: "13. Flowcharts Q7",
    thumbnail: "https://i.postimg.cc/YqPR42gg/t-N8-CRb5om-ZPKspi-J-generated-image-1.jpg",
    url: "https://drive.google.com/file/d/1oWEd-2NyNChnVX7yOGg2Ahw6uiEKXz0L/preview",
    uploader: "Preetam Singh",
    views: "550",
    uploadDate: "9 days ago",
    description:
      "Learn about greedy algorithms and their applications in optimization problems like the Knapsack problem.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "28",
    comments: "10",
  },
  {
    id: "10",
    title: "14. Flowcharts Q8",
    thumbnail: "https://i.postimg.cc/5tVwvXtH/image.png",
    url: "https://drive.google.com/file/d/1oELj_vmEJllcPh7Ez5S71qwU-OfdUKjb/preview",
    uploader: "Preetam Singh",
    views: "700",
    uploadDate: "10 days ago",
    description: "Understand the divide and conquer approach with examples like MergeSort and QuickSort.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "40",
    comments: "18",
  },
  {
    id: "11",
    title: "15. Flowcharts Q9",
    thumbnail: "https://i.postimg.cc/wjKJ81LW/image.png",
    url: "https://drive.google.com/file/d/1g1zJcc0hgC9x6XVz7oB3q4s4Q2PJJPyN/preview",
    uploader: "Preetam Singh",
    views: "480",
    uploadDate: "11 days ago",
    description: "Learn about heap data structures, including min-heap and max-heap, and their applications.",
    platform: "Google Drive", // Corrected platform
    category: "Flowcharts", // Corrected category
    likes: "32",
    comments: "14",
  },
  {
    id: "12",
    title: "16. Patterns Q1",
    thumbnail: "https://i.postimg.cc/0NHPFHB7/image.png",
    url: "https://drive.google.com/file/d/1LoDpAYoBU6FXFsyZRlhOU6jrQK_S52-j/preview",
    uploader: "Preetam Singh",
    views: "520",
    uploadDate: "12 days ago",
    description: "Explore graph traversal algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS).",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "27",
    comments: "11",
  },
  {
    id: "13",
    title: "17. Patterns Q2",
    thumbnail: "https://i.postimg.cc/5ySyFSsy/image.png",
    url: "https://drive.google.com/file/d/1BYod35N1ysoxoL4uosaIDRjWvrb4fxTr/preview",
    uploader: "Preetam Singh",
    views: "600",
    uploadDate: "13 days ago",
    description: "Solve the Matrix Chain Multiplication problem using dynamic programming.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "45",
    comments: "20",
  },
  {
    id: "14",
    title: "18. Patterns Q3",
    thumbnail: "https://i.postimg.cc/wTBgVzv0/image.png",
    url: "https://drive.google.com/file/d/1351_NpGduG58nJFoBQ0a64zgiaQ9rEhc/preview",
    uploader: "Preetam Singh",
    views: "550",
    uploadDate: "14 days ago",
    description: "Understand backtracking with the classic N-Queens problem and its implementation.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "38",
    comments: "16",
  },
  {
    id: "15",
    title: "19. Patterns Q4",
    thumbnail: "https://i.postimg.cc/15b2q1Ng/image.png",
    url: "https://drive.google.com/file/d/1a9AkOSfeVhoOGghSuNF4c4lV8TObITAM/preview",
    uploader: "Preetam Singh",
    views: "470",
    uploadDate: "15 days ago",
    description: "Learn about segment trees and their applications in range queries and updates.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "33",
    comments: "13",
  },
  {
    id: "16",
    title: "20. Pattern continues [HD]",
    thumbnail: "https://i.postimg.cc/qRmZBPTv/image.png",
    url: "https://drive.google.com/file/d/1-Li_n9ne7YBuBIWr9qr4rA4Rih08j6H1/preview",
    uploader: "Preetam Singh",
    views: "490",
    uploadDate: "16 days ago",
    description: "Understand the Trie data structure and its use cases in string processing.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "29",
    comments: "12",
  },
  {
    id: "17",
    title: "21.Operators, Loops & Conditionals [HD]... ",
    thumbnail: "https://i.postimg.cc/5t8SkZ0R/image.png",
    url: "https://drive.google.com/file/d/1ApbLs3GwESxV04tyVy_gHmpMLdW2z6W2/preview",
    uploader: "Preetam Singh",
    views: "510",
    uploadDate: "17 days ago",
    description: "Learn about Disjoint Set Union (DSU) and its applications in graph algorithms.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Basics", // Corrected category
    likes: "36",
    comments: "17",
  },
  {
    id: "18",
    title: "22.Functions & some Problem Statement... ",
    thumbnail: "https://i.postimg.cc/3xkZTkLV/image.png",
    url: "https://drive.google.com/file/d/1VY3c-DYEK6sawbU7DO3MAuuPE2WAXtIA/preview",
    uploader: "Preetam Singh",
    views: "530",
    uploadDate: "18 days ago",
    description: "Explore advanced graph algorithms like Dijkstra's algorithm and Bellman-Ford.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Basics", // Corrected category
    likes: "41",
    comments: "19",
  },
  {
    id: "19",
    title: "23.Number System - Binary && Decimal.... ",
    thumbnail: "https://i.postimg.cc/c488dPy1/image.png",
    url: "https://drive.google.com/file/d/1XrxU2_W4W7SqM1SJqpmooRipT2x-2scw/preview",
    uploader: "Preetam Singh",
    views: "570",
    uploadDate: "19 days ago",
    description: "Solve the Matrix Chain Multiplication problem using dynamic programming.",
    platform: "Google Drive", // Corrected platform
    category: "Number Systems", // Corrected category
    likes: "44",
    comments: "21",
  },
  {
    id: "20",
    title: "24.Numeric Hollow Half Pyramid",
    thumbnail: "https://i.postimg.cc/JnkGRBv6/image.png",
    url: "https://drive.google.com/file/d/1VPxHkoTB10zWW5VyzBoD5RrJQKD1wgIo/preview",
    uploader: "Preetam Singh",
    views: "590",
    uploadDate: "20 days ago",
    description: "Learn about advanced sorting algorithms like Radix Sort and Counting Sort.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "47",
    comments: "23",
  },
  {
    id: "21",
    title: "25. Numeric Hollow Inverted Half Pyrami... ",
    thumbnail: "https://i.postimg.cc/RhxQmmst/image.png",
    url: "https://drive.google.com/file/d/1BmdmhzFBUYuYjYaIljsSc8DAWs10qNa3/preview",
    uploader: "Preetam Singh",
    views: "620",
    uploadDate: "21 days ago",
    description: "Explore shortest path algorithms like Dijkstra's and Bellman-Ford with practical examples.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "50",
    comments: "25",
  },
  {
    id: "22",
    title: "26. Numeric Palindrome Equilateral Pyra... ",
    thumbnail: "https://i.postimg.cc/fTwqS7C9/image.png",
    url: "https://drive.google.com/file/d/1pwQppXCVEZ5gaeueS34euR9FBuFupnNQ/preview",
    uploader: "Preetam Singh",
    views: "630",
    uploadDate: "22 days ago",
    description: "Solve the Longest Common Subsequence (LCS) problem using dynamic programming.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "52",
    comments: "27",
  },
  {
    id: "23",
    title: "27.Solid Half Diamond",
    thumbnail: "https://i.postimg.cc/RCfQC3zn/image.png",
    url: "https://drive.google.com/file/d/1C0zPOoebQn2Y1rhUIcLGpRfnEWEaBm-4/preview",
    uploader: "Preetam Singh",
    views: "640",
    uploadDate: "23 days ago",
    description:
      "Learn about Red-Black trees, a self-balancing binary search tree, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "55",
    comments: "30",
  },
  {
    id: "24",
    title: "28. Fancy Pattern #1",
    thumbnail: "https://i.postimg.cc/9FLvbgN2/image.png",
    url: "https://drive.google.com/file/d/1Qy6BxxDN69zxdm1aYE-4P5BOLZ4WDGCQ/preview",
    uploader: "Preetam Singh",
    views: "650",
    uploadDate: "24 days ago",
    description: "Understand backtracking with the classic Sudoku Solver problem and its implementation.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "58",
    comments: "32",
  },
  {
    id: "25",
    title: "29. Fancy Pattern #2",
    thumbnail: "https://i.postimg.cc/BQkHDHfg/image.png",
    url: "https://drive.google.com/file/d/1utO4vyFKfQ5HipXKcFdLkvdqwGKKwJVi/preview",
    uploader: "Preetam Singh",
    views: "660",
    uploadDate: "25 days ago",
    description: "Learn about the Fractional Knapsack problem and its solution using greedy algorithms.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "60",
    comments: "35",
  },
  {
    id: "26",
    title: "30. Fancy Pattern #3",
    thumbnail: "https://i.postimg.cc/qvY9Km17/image.png",
    url: "https://drive.google.com/file/d/1I-SADyrObb-Igu8SacYJhOkWYcX25hBw/preview",
    uploader: "Preetam Singh",
    views: "670",
    uploadDate: "26 days ago",
    description: "Solve the Coin Change problem using dynamic programming with detailed explanations.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "62",
    comments: "37",
  },
  {
    id: "27",
    title: "31. Floyd's Triangle Pattern",
    thumbnail: "https://i.postimg.cc/L8wsxF9K/image.png",
    url: "https://drive.google.com/file/d/1QqSs_tKTn4HWXLe2GPomnSjw-nEJYTAr/preview",
    uploader: "Preetam Singh",
    views: "680",
    uploadDate: "27 days ago",
    description: "Explore Minimum Spanning Tree algorithms like Kruskal's and Prim's with practical examples.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "65",
    comments: "40",
  },
  {
    id: "28",
    title: "32. Pascal's Triangle Pattern",
    thumbnail: "https://i.postimg.cc/BQX6GnwP/image.png",
    url: "https://drive.google.com/file/d/1oQfQl4N6YA01rdBugo-6fPBxdXJUx-q_/preview",
    uploader: "Preetam Singh",
    views: "690",
    uploadDate: "28 days ago",
    description: "Learn about B-Trees, a self-balancing tree data structure used in databases and file systems.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "68",
    comments: "42",
  },
  {
    id: "29",
    title: "33. Butterfly Pattern",
    thumbnail: "https://i.postimg.cc/G36smfTp/image.png",
    url: "https://drive.google.com/file/d/15I6HffTDlCKPzX-Y3LNoQNMCDr0vw__I/preview",
    uploader: "Preetam Singh",
    views: "700",
    uploadDate: "29 days ago",
    description: "Solve the Longest Increasing Subsequence (LIS) problem using dynamic programming.",
    platform: "Google Drive", // Corrected platform
    category: "Programming Patterns", // Corrected category
    likes: "70",
    comments: "45",
  },
  {
    id: "30",
    title: "34. Display Area Of Circle",
    thumbnail: "https://i.postimg.cc/3JHJ6QD2/image.png",
    url: "https://drive.google.com/file/d/1tgp59Y1p6gufznSSXLNuFlVfcktjvOXM/preview",
    uploader: "Preetam Singh",
    views: "710",
    uploadDate: "30 days ago",
    description: "Understand topological sorting and its applications in scheduling and dependency resolution.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "72",
    comments: "47",
  },
  {
    id: "31",
    title: "35. Given Number Is Even or Odd",
    thumbnail: "https://i.postimg.cc/MKbP01S1/image.png",
    url: "https://drive.google.com/file/d/1huIw40LYASwW70E70OZSZ0ey-7Bq0CtV/preview",
    uploader: "Preetam Singh",
    views: "720",
    uploadDate: "31 days ago",
    description: "Learn about Fenwick Trees (Binary Indexed Trees) and their applications in range queries.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "75",
    comments: "50",
  },
  {
    id: "32",
    title: "36. Find The Factorial",
    thumbnail: "https://i.postimg.cc/QdXbQqc1/image.png",
    url: "https://drive.google.com/file/d/1gQGqvGxjcvk85ASxVpyblF1ZzPCE7pAV/preview",
    uploader: "Preetam Singh",
    views: "730",
    uploadDate: "32 days ago",
    description: "Solve the Edit Distance problem using dynamic programming with detailed explanations.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "78",
    comments: "52",
  },
  {
    id: 33,
    title: "37. Check Given Number Prime or Not.m... ",
    thumbnail: "https://i.postimg.cc/nhBJmpYC/image.png",
    url: "https://drive.google.com/file/d/1XxcJK3TbcquLcXmMRBqIc64BB-4QXeKV/preview",
    uploader: "Preetam Singh",
    views: "740",
    uploadDate: "33 days ago",
    description: "Explore Strongly Connected Components (SCC) in directed graphs with practical examples.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "80",
    comments: "55",
  },
  {
    id: 34,
    title: "38. Print All Prime From 1 to N",
    thumbnail: "https://i.postimg.cc/KYTwVNsj/image.png",
    url: "https://drive.google.com/file/d/1L-tEqZ0r9luWXYYQxRCn42pdP6QBe--Q/preview",
    uploader: "Preetam Singh",
    views: "750",
    uploadDate: "34 days ago",
    description: "Learn about Suffix Trees and their applications in string processing and pattern matching.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "82",
    comments: "57",
  },
  {
    id: 35,
    title: "39. Reverse Integer",
    thumbnail: "https://i.postimg.cc/rsT9mGJh/image.png",
    url: "https://drive.google.com/file/d/1tmqBZZc4YF8X9k0m78bodYa_WsLbHP2y/preview",
    uploader: "Preetam Singh",
    views: "760",
    uploadDate: "35 days ago",
    description: "Solve the 0/1 Knapsack problem using dynamic programming with step-by-step explanations.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "85",
    comments: "60",
  },
  {
    id: 36,
    title: "40. Set the Kth Bit",
    thumbnail: "https://i.postimg.cc/R0Md4LgX/image.png",
    url: "https://drive.google.com/file/d/11TfhD1HxnR-HzdSv99MguA429ccZg82k/preview",
    uploader: "Preetam Singh",
    views: "770",
    uploadDate: "36 days ago",
    description: "Understand Eulerian and Hamiltonian paths in graphs with practical examples.",
    platform: "Google Drive", // Corrected platform
    category: "Bit Manipulation", // Corrected category
    likes: "88",
    comments: "62",
  },
  {
    id: 37,
    title: "41. Convert the Temperature",
    thumbnail: "https://i.postimg.cc/L5Mwk1H7/image.png",
    url: "https://drive.google.com/file/d/16nvgLBUFzCUH_EYMGifVQcIS9K-mdCc3/preview",
    uploader: "Preetam Singh",
    views: "780",
    uploadDate: "37 days ago",
    description: "Learn about Segment Trees and their applications in range queries and updates.",
    platform: "Google Drive", // Corrected platform
    category: "Math Problems", // Corrected category
    likes: "90",
    comments: "65",
  },
  {
    id: 38,
    title: "42. Introduction to Time & Space Compl... ",
    thumbnail: "https://i.postimg.cc/Wpw2qjV9/image.png",
    url: "https://drive.google.com/file/d/1Nxist0IGfux5mOLWYs_KXnqHLAEwMv-W/preview",
    uploader: "Preetam Singh",
    views: "790",
    uploadDate: "38 days ago",
    description: "Solve the Rod Cutting problem using dynamic programming with detailed explanations.",
    platform: "Google Drive", // Corrected platform
    category: "Complexity Analysis", // Corrected category
    likes: "92",
    comments: "67",
  },
  {
    id: 39,
    title: "43. Arrays - Class 1 [HD]",
    thumbnail: "https://i.postimg.cc/2jWMtxyg/image.png",
    url: "https://drive.google.com/file/d/19IwYNbLrF8xzpyQuQH3aIl1o2bzCutQU/preview",
    uploader: "Preetam Singh",
    views: "800",
    uploadDate: "39 days ago",
    description: "Explore Network Flow algorithms like Ford-Fulkerson and Edmonds-Karp with practical examples.",
    platform: "Google Drive", // Corrected platform
    category: "Arrays", // Corrected category
    likes: "95",
    comments: "70",
  },
  {
    id: 40,
    title: "44. Arrays - Class 2 [HD]",
    thumbnail: "https://i.postimg.cc/fTXm4VQH/image.png",
    url: "https://drive.google.com/file/d/16W2CpZqHWqj5EOIysXSfXv5T5hWAtGsd/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Arrays", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 41,
    title: "45. Arrays - Class 3 [HD]",
    thumbnail: "https://i.postimg.cc/MT2JF373/image.png",
    url: "https://drive.google.com/file/d/1owJsQe1-WVQbGCJ-bMlKC3vEkE50OY_k/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Arrays", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 42,
    title: "46. Sort Colors",
    thumbnail: "https://i.postimg.cc/bJmfLxTs/image.png",
    url: "https://drive.google.com/file/d/1DC0fnBxYK3EBbCjd5aWwmUrkFROSEoJE/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Sorting Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 43,
    title: "47. Move All Negative Number To The Left Side Of An Array",
    thumbnail: "https://i.postimg.cc/6qrGQs7G/image.png",
    url: "https://drive.google.com/file/d/1HyXEluUGoT0FFtmnLjWBX1rOSCWvKutm/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 44,
    title: "48. Find Duplicate Number",
    thumbnail: "https://i.postimg.cc/tC3pB3nk/image.png",
    url: "https://drive.google.com/file/d/17rr_HVG4V_KApc3sFA26moKTFNlGB63J/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 45,
    title: "49. Missing Elements From An Array With Duplicates",
    thumbnail: "https://i.postimg.cc/xCrX4WS7/image.png",
    url: "https://drive.google.com/file/d/1JF9ChshbhPKsQSro05mrvbb-PsIxLW-P/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 46,
    title: "50. Find First Repeating Element",
    thumbnail: "https://i.postimg.cc/PJTPtYJQ/image.png",
    url: "https://drive.google.com/file/d/17n-ZoUkWqJNzuSAlegDpFvm9KXwFncdP/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 47,
    title: "51. Common Elements In 3 Sorted Array",
    thumbnail: "https://i.postimg.cc/fLwNyK7y/image.png",
    url: "https://drive.google.com/file/d/1CGLNWtmg9lYeJYgXeOF_KMyQTTcdj2CL/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 48,
    title: "52. Wave Print A Matrix",
    thumbnail: "https://i.postimg.cc/MKhJVx0h/image.png",
    url: "https://drive.google.com/file/d/1ouAbnpenm1RVGWv0pC_3nPWN_YFMux7u/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Matrix Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 49,
    title: "53. Spiral Print A Matrix",
    thumbnail: "https://i.postimg.cc/J7s1kTVH/image.png",
    url: "https://drive.google.com/file/d/1O315LTWRPkDbm8JKS0bONkM5cL-Hl1Y0/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Matrix Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 50,
    title: "54. Factorial Of A Large Number",
    thumbnail: "https://i.postimg.cc/YCzkHZgZ/image.png",
    url: "https://drive.google.com/file/d/1yLOqzfIt3swLcQfGN3ePHljeUohS_8l1/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Large Numbers", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 51,
    title: "55. Searching and Sorting Class - I [HD]",
    thumbnail: "https://i.postimg.cc/QNK3tH1p/image.png",
    url: "https://drive.google.com/file/d/17N7u9sa1g_T0JD5DQKz1R6GeUWkm3VYZ/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Sorting & Searching", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 52,
    title: "56. Searching and Sorting Class - II [HD]",
    thumbnail: "https://i.postimg.cc/HnQtVwTZ/image.png",
    url: "https://drive.google.com/file/d/1M9tdkrP1KvcP_P9DOltdQ3ehtAi0RKza/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Sorting & Searching", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 53,
    title: "57. Searching and Sorting Class - III [HD]",
    thumbnail: "https://i.postimg.cc/MK3YXpw8/image.png",
    url: "https://drive.google.com/file/d/1CgvxpAE1W4CjeMVZjqGYhNhT4zGhA2_y/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Sorting & Searching", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 54,
    title: "58. Week-4 [Connect] [HD]",
    thumbnail: "https://i.postimg.cc/vZSRbV3F/5c-DEMx-NJu9-Kh8hlm-generated-image-1.jpg",
    url: "https://drive.google.com/file/d/13s_Qw7G0mBs3PEMsnIBF3znulx4Yw9tH/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Data Structures", // Corrected category (based on description)
    likes: "98",
    comments: "72",
  },
  {
    id: 55,
    title: "59. K-Diff Pairs In An Array",
    thumbnail: "https://i.postimg.cc/d0TfFShr/image.png",
    url: "https://drive.google.com/file/d/1AXmQsWYhgIp5rPO8Vf1GzJk7zLTarE5n/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 56,
    title: "60. Find K-Closest Element",
    thumbnail: "https://i.postimg.cc/vHcLCxg6/image.png",
    url: "https://drive.google.com/file/d/1Ifsu_QldvyuxVuex044aONXL1uHQes4i/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Array Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 57,
    title: "61. Exponential Search & Unbounded Binary Search",
    thumbnail: "https://i.postimg.cc/mDFk4R4R/3bub-LIUirb-Hr-Eq-CX-generated-image.jpg",
    url: "https://drive.google.com/file/d/1kKPYT5jTG7I1icvMDxgM5yOZ-ahCIKwE/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Search Algorithms", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 58,
    title: "62. Book Allocation Problem",
    thumbnail: "https://i.postimg.cc/fbwZ5956/8r-Ih-Lbw-G3-Jt-Vy-N8-T-generated-image.jpg",
    url: "https://drive.google.com/file/d/1GajJPgPZjDQvoafZvdshY5dCGWrHg9j4/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 59,
    title: "63. Painters Partition Problem",
    thumbnail: "https://i.postimg.cc/43yYxqtL/Eux-Hhs-Dw-HFTzxf-DC-generated-image.jpg",
    url: "https://drive.google.com/file/d/19pRqclGsE4hFtVORpwOXcv52QnMOOXLY/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 60,
    title: "64. Aggresive Cows",
    thumbnail: "https://i.postimg.cc/QMjLNRy2/wiiiqj-Op0-YUJrz-Hv-generated-image.jpg",
    url: "https://drive.google.com/file/d/1iFwEI1nkRtpeLWJIiYxxzyXhW7XQxCD2/preview",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Google Drive", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 61,
    title: "65. EKO SPOJ",
    thumbnail: "https://i.postimg.cc/J7cs1dQj/nm-Oad-Nn-Fa7h-VTt-Xd-generated-image.jpg",
    url: "https://geo.dailymotion.com/player.html?video=x9fmu0y", // Updated URL from prompt
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Dailymotion", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 62,
    title: "66. PRATA SPOJ",
    thumbnail: "https://i.postimg.cc/bwFS2Cdd/l-DQb-ZEvo-O0-Utsc-Ad-generated-image.jpg",
    url: "https://geo.dailymotion.com/player.html?video=x9fmu5m",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Dailymotion", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 63,
    title: "67. Char Arrays & Strings - Class I [HD]",
    thumbnail: "https://i.postimg.cc/ZnfFKXsH/E7u-Gkr-Kh-VZn-K6-JMG-generated-image.jpg",
    url: "https://geo.dailymotion.com/player.html?video=x9fmu5o",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Dailymotion", // Corrected platform
    category: "Strings", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 64,
    title: "68. Char Arrays & Strings - Class II [HD]",
    thumbnail: "https://i.postimg.cc/3Rm5D5sK/GSqdq-D5a6-B8-T0uta-generated-image.jpg",
    url: "https://rumble.com/embed/v6odv6g/?pub=4kw2q0",
    uploader: "Preetam Singh",
    views: "810",
    uploadDate: "40 days ago",
    description:
      "Learn about Treaps, a combination of binary search trees and heaps, with insertion and deletion examples.",
    platform: "Rumble", // Corrected platform
    category: "Strings", // Corrected category
    likes: "98",
    comments: "72",
  },
  {
    id: 65,
    title: "69. Week-5 [Connect] [HD]",
    thumbnail: "https://i.postimg.cc/nczqJyq3/gz-CFcd9-Hhtrdxre-T-generated-image-1.jpg",
    url: "https://rumble.com/embed/v6odvf0/?pub=4kw2q0u",
    uploader: "Preetam SINGH",
    views: "500",
    uploadDate: "30 days ago",
    description: "A video on Dailymotion platform.", // Description doesn't match URL/Title
    platform: "Rumble", // Corrected platform
    category: "General Programming", // Corrected category (vague title)
    likes: "50",
    comments: "10",
  },
  {
    id: 66,
    title: "70. Valid Anagram",
    thumbnail: "https://i.postimg.cc/9MC2v3cg/PDwno-W1wvx-O9-Tw-Zr-generated-image.jpg",
    url: "https://geo.dailymotion.com/player.html?video=x9fmu5i",
    uploader: "Unknown",
    views: "600",
    uploadDate: "25 days ago",
    description: "Another video on Dailymotion platform.",
    platform: "Dailymotion", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "60",
    comments: "15",
  },
  {
    id: 67,
    title: "71. Reverse Only Letters",
    thumbnail: "https://i.postimg.cc/52YyPn1K/VWspsl9t5xz-NJr-SD-generated-image.jpg",
    url: "https://www.youtube.com/embed/otgIpRA_4k4?si=7vafPKcL8_QdcOPs",
    uploader: "Unknown",
    views: "700",
    uploadDate: "20 days ago",
    description: "Yet another video on Dailymotion platform.", // Description doesn't match URL
    platform: "YouTube", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "70",
    comments: "20",
  },
  {
    id: 68,
    title: "72. Longest Common Prefix",
    thumbnail: "https://i.postimg.cc/qq6vvxwZ/ZAt5of-J4-Zi0-WFX53-generated-image.jpg",
    url: "https://www.youtube.com/embed/WAV0EJ7C3Nk?si=7X0-ig1jblGCPzDe",
    uploader: "Unknown",
    views: "800",
    uploadDate: "15 days ago",
    description: "A video on Youtube platform.",
    platform: "YouTube", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "80",
    comments: "25",
  },
  {
    id: 69,
    title: "73. Reverse Vowels Of A String",
    thumbnail: "https://i.postimg.cc/fLJ9YX5Y/GMly51-Kh-SPqt-Qf-Ul-generated-image.jpg",
    url: "https://www.youtube.com/embed/otgIpRA_4k4?si=yMaWe5bUuG75XOe6",
    uploader: "Unknown",
    views: "900",
    uploadDate: "10 days ago",
    description: "Another video on Youtube platform.",
    platform: "YouTube", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "90",
    comments: "30",
  },
  {
    id: 70,
    title: "74. Isomorphic Strings",
    thumbnail: "https://i.postimg.cc/1zgmHHhR/K4n-H4-MLPo-TXlz-RCO-generated-image-1.jpg",
    url: "https://rumble.com/embed/v6odvfq/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1000",
    uploadDate: "5 days ago",
    description: "Another video on Dailymotion platform.", // Description doesn't match URL
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "100",
    comments: "35",
  },
  {
    id: 71,
    title: "75. Reorganise String",
    thumbnail: "https://i.postimg.cc/FzGXmd5n/k-ZRSHm-XYYDfz-Gss-Y-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvge/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1100",
    uploadDate: "2 days ago",
    description: "A video on YouTube platform.", // Description doesn't match URL
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "110",
    comments: "40",
  },
  {
    id: 72,
    title: "76. Group Anagrams",
    thumbnail: "https://i.postimg.cc/J03Zh8PF/u-Qc-QEMBsbvfi-Px-Af-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvhi/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1200",
    uploadDate: "1 day ago",
    description: "Another video on YouTube platform.", // Description doesn't match URL
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "120",
    comments: "45",
  },
  {
    id: 73,
    title: "77. Longest Palindromic Substring",
    thumbnail: "https://i.postimg.cc/xTtNpt7L/ZI0-Cp-WQ9-Og-Sc-Gg-Br-generated-image.jpg",
    url: "https://www.youtube.com/embed/otgIpRA_4k4?si=yMaWe5bUuG75XOe6", // URL is same as ID 69
    uploader: "Unknown",
    views: "1300",
    uploadDate: "1 day ago",
    description: "Yet another video on YouTube platform.",
    platform: "YouTube", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "130",
    comments: "50",
  },
  {
    id: 74,
    title: "78. Find The Index Of First Occurence in a String",
    thumbnail: "https://i.postimg.cc/hj1tzGRV/Ga-OYTBBU22gcbk-KL-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvhw/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1400",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "140",
    comments: "55",
  },
  {
    id: 75,
    title: "79. String To Integer (atoi)",
    thumbnail: "https://i.postimg.cc/pLjx5dDy/Ug-BMIIw-Ob-FEG5-Bl9-generated-image-1.jpg",
    url: "https://rumble.com/embed/v6odvj8/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1500",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Conversion", // Corrected category
    likes: "150",
    comments: "60",
  },
  {
    id: 76,
    title: "80. String Compression",
    thumbnail: "https://i.postimg.cc/3J4Qzwf9/TDyg7e0-Ga23-C64-EU-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvka/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1600",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "160",
    comments: "65",
  },
  {
    id: 77,
    title: "81. Integer To Romans",
    thumbnail: "https://i.postimg.cc/kX3d3Crm/4n9jpa692h55-Uy-UY-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvkm/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1700",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Conversion", // Corrected category
    likes: "170",
    comments: "70",
  },
  {
    id: 78,
    title: "82. Zig-Zag Conversion",
    thumbnail: "https://i.postimg.cc/T1nFYy8X/n7-ORMb-W1g-F36-Y4-FH-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvlc/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1800",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "180",
    comments: "75",
  },
  {
    id: 79,
    title: "83. Largest Number",
    thumbnail: "https://i.postimg.cc/hGhYQZFs/69-Q3-V1r-Nr-QSBAli-N-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvmm/?pub=4kw2q0",
    uploader: "Unknown",
    views: "1900",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "190",
    comments: "80",
  },
  {
    id: 80,
    title: "84. Pointers - Level 1 [HD]",
    thumbnail: "https://i.postimg.cc/yYMxbtjg/ea-T6wx0id-PIWr-QMQ-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvu8/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2000",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Pointers", // Corrected category
    likes: "200",
    comments: "85",
  },
  {
    id: 81,
    title: "85. Pointers - Level 2 [HD]",
    thumbnail: "https://i.postimg.cc/1zHz4tQw/d-Wl-Ec-TCUAJGc-Aq-Nk-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvw8/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2100",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Pointers", // Corrected category
    likes: "210",
    comments: "90",
  },
  {
    id: 82,
    title: "86. Basic Mathematics For DSA",
    thumbnail: "https://i.postimg.cc/pd2WNHFT/8-Mzvtl-Xhzgfx-YG0-U-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvsg/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2200",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Math & Number Theory", // Corrected category
    likes: "220",
    comments: "95",
  },
  {
    id: 83,
    title: "87. Pointers - Level 3 [HD]",
    thumbnail: "https://i.postimg.cc/YCJbsrLc/IOMB6ff0-Tr-Mx69-Ky-generated-image.jpg",
    url: "https://rumble.com/embed/v6odvt0/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2300",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Pointers", // Corrected category
    likes: "230",
    comments: "100",
  },
  {
    id: 84,
    title: "88. Optimising Sieve & Segmented Sieve",
    thumbnail: "https://i.postimg.cc/6QtMd97B/Ei-Gy11-CSwix8ro-Qp-generated-image.jpg",
    url: "https://rumble.com/embed/v6odw3i/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2400",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Math Algorithms", // Corrected category
    likes: "240",
    comments: "105",
  },
  {
    id: 85,
    title: "89. Let's Practice Pointers",
    thumbnail: "https://i.postimg.cc/kX8Qgkj9/Jj-Rvz-Ssw-O3x6k7k-C-generated-image.jpg",
    url: "https://rumble.com/embed/v6odw3g/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2500",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Pointers", // Corrected category
    likes: "250",
    comments: "110",
  },
  {
    id: 86,
    title: "90. Time & Space Complexity Of Recursive Solutions",
    thumbnail: "https://i.postimg.cc/yxhxVjPy/n8-MP5-Njfoah-Mh-Sb2-generated-image.jpg",
    url: "https://rumble.com/embed/v6odw42/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2600",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Complexity Analysis", // Corrected category
    likes: "260",
    comments: "115",
  },
  {
    id: 87,
    title: "91. Recursion - Level 1 [HD]",
    thumbnail: "https://i.postimg.cc/SRmnQvjQ/x-FNVe-Cx77d-SOo-Toh-generated-image-1.jpg",
    url: "https://rumble.com/embed/v6odw74/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2700",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category
    likes: "270",
    comments: "120",
  },
  {
    id: 88,
    title: "92. Recursion - Level 2 [HD]",
    thumbnail: "https://i.postimg.cc/bvGb4WSK/o-JMw-RU6yjg-Y9-Ib3b-generated-image.jpg",
    url: "https://rumble.com/embed/v6odw9u/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2800",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category
    likes: "280",
    comments: "125",
  },
  {
    id: 89,
    title: "93. Recursion - Level 3[HD]",
    thumbnail: "https://i.postimg.cc/SNprCSYj/YL2-F71-Fo8c-Dt-C4l6-generated-image.jpg/",
    url: "https://rumble.com/embed/v6odw9w/?pub=4kw2q0",
    uploader: "Unknown",
    views: "2900",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category
    likes: "290",
    comments: "130",
  },
  {
    id: 90,
    title: "94. Recursion - Level 4 [HD]",
    thumbnail: "https://i.postimg.cc/28VzdYpR/O5xc0-Vp-XVu-EX8-ZG8-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwb6/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3000",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category
    likes: "300",
    comments: "135",
  },
  {
    id: 91,
    title: "95. Last Occurence Of A Char",
    thumbnail: "https://i.postimg.cc/VLMPYB2p/Ri-QH469-RCKX5-Uws-V-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwee/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3100",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "310",
    comments: "140",
  },
  {
    id: 92,
    title: "96. Reverse A String RE",
    thumbnail: "https://i.postimg.cc/HnXRm1sj/w-XIC7-Vt8q-Wi-GYL83-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwfe/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3200",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category (RE implies Recursion)
    likes: "320",
    comments: "145",
  },
  {
    id: 93,
    title: "97. Add Strings RE",
    thumbnail: "https://i.postimg.cc/Hk9yNgjS/bbx-Xb-Ns-Vd-UUwa-ECh-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwha/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3300",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category (RE implies Recursion)
    likes: "330",
    comments: "150",
  },
  {
    id: 94,
    title: "98. Palindrome Check RE",
    thumbnail: "https://i.postimg.cc/15xV5tqC/3z5-JEHi-G2-SQj-Xmn8-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwh2/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3400",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category (RE implies Recursion)
    likes: "340",
    comments: "155",
  },
  {
    id: 95,
    title: "99. Remove All Occurrences of a Substring",
    thumbnail: "https://i.postimg.cc/MTMXz2KJ/ml-DIL9-D4-KJ2o9-HYG-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwi8/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3500",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category
    likes: "350",
    comments: "160",
  },
  {
    id: 96,
    title: "100. Print All Subarrays Using RE",
    thumbnail: "https://i.postimg.cc/Y9W2J6bp/JR5n-Oe9lvyqs-Ygg-V-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwj2/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3600",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Recursion", // Corrected category (RE implies Recursion)
    likes: "360",
    comments: "165",
  },
  {
    id: 97,
    title: "101. Buy & Sell Stocks",
    thumbnail: "https://i.postimg.cc/43KX9vCz/Y5i-Ea-Giu-UJO6c-T2w-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwjy/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3700",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Algorithm Problems", // Corrected category
    likes: "370",
    comments: "170",
  },
  {
    id: 98,
    title: "102. House Robber Problem",
    thumbnail: "https://i.postimg.cc/6pkmMC2V/v-GYq-P8cjqd-Apy-HVq-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwli/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3800",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Algorithm Problems", // Corrected category (DP problem)
    likes: "380",
    comments: "175",
  },
  {
    id: 99,
    title: "103. Integer to English Words",
    thumbnail: "https://i.postimg.cc/sgj8B5Qw/wo-CNA05oh3-RUxm-YJ-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwpe/?pub=4kw2q0",
    uploader: "Unknown",
    views: "3900",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Conversion", // Corrected category
    likes: "390",
    comments: "180",
  },
  {
    id: 100,
    title: "104. Wild Card Matching Matching", // Duplicate "Matching" in title
    thumbnail: "https://i.postimg.cc/1t6bTjmM/Z7-EZga-On-Go1-SKJ5-U-generated-image.jpg/",
    url: "https://rumble.com/embed/v6odwsy/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4000",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "String Algorithms", // Corrected category (DP/Matching problem)
    likes: "400",
    comments: "185",
  },
  {
    id: 101,
    title: "131. Inline Functions", // Jump in numbering
    thumbnail: "https://i.postimg.cc/j21gS6SC/9t43b-UHb-JWQg-U9bb-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwt4/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4100",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "C++ Concepts", // Corrected category
    likes: "410",
    comments: "190",
  },
  {
    id: 102,
    title: "132. Friend Keyword In C++",
    thumbnail: "https://i.postimg.cc/CxgtBN4f/Wo8-CQf-X2-IOzoahxw-generated-image.jpg/",
    url: "https://rumble.com/embed/v6odwue/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4200",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "C++ Concepts", // Corrected category
    likes: "420",
    comments: "195",
  },
  {
    id: 103,
    title: "133. Can Constructor Be Made Private",
    thumbnail: "https://i.postimg.cc/438F0TRz/c-L6-Iq-XWBzg-P3-QW53-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwv0/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4300",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "C++ Concepts", // Corrected category
    likes: "430",
    comments: "200",
  },
  {
    id: 104,
    title: "134. Virtual Constructor VS Virtual Destructor",
    thumbnail: "https://i.postimg.cc/3NGSW44B/KHpl8l-Mk-I9c-Eq63-Q-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwxe/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4400",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "C++ Concepts", // Corrected category
    likes: "440",
    comments: "205",
  },
  {
    id: 105,
    title: "135. Memory Layout Of A Program",
    thumbnail: "https://i.postimg.cc/prdVHvmR/Sf-Bmfsr6guvn-TZpv-generated-image.jpg",
    url: "https://rumble.com/embed/v6odwwy/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4500",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Programming Concepts", // Corrected category
    likes: "450",
    comments: "210",
  },
  {
    id: 106,
    title: "136. LL Class - 1 [HD]",
    thumbnail: "https://i.postimg.cc/nh36ymvj/6r-Thity-Tf5d-KBYGx-generated-image.jpg",
    url: "https://rumble.com/embed/v6odx68/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4600",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "460",
    comments: "215",
  },
  {
    id: 107,
    title: "137. LL Class - 2 [HD]",
    thumbnail: "https://i.postimg.cc/9fvN2YzM/Apfd-Z1q-POq-Tlh-Efd-generated-image.jpg",
    url: "https://rumble.com/embed/v6odx7o/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4700",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "470",
    comments: "220",
  },
  {
    id: 108,
    title: "138. LL Class - 3 [HD] ",
    thumbnail: "https://i.postimg.cc/YqqRJs8R/VYBecp-Ri-Qi-ZK2jn-L-generated-image.jpg",
    url: "https://rumble.com/embed/v6odx78/?pub=4kw2q0",
    uploader: "", // Uploader was empty
    views: "4800",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "480",
    comments: "225",
  },
  {
    id: 109,
    title: "139. LL Class - 4 [HD]",
    thumbnail: "https://i.postimg.cc/PJfbnCbJ/3-Nr-CKns-Vx8-M5t-HIs-generated-image.jpg",
    url: "https://rumble.com/embed/v6odx9c/?pub=4kw2q0",
    uploader: "Unknown",
    views: "4900",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "490",
    comments: "230",
  },
  {
    id: 110,
    title: "140. Print Nth Node From The End",
    thumbnail: "https://i.postimg.cc/DZ0c7DLr/Lsquz2-D7x-L8-Dm-Bfl-generated-image.jpg",
    url: "https://rumble.com/embed/v6odx3e/?pub=4kw2q0",
    uploader: "PREETAM SINGH",
    views: "5000",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.",
    platform: "Rumble", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "500",
    comments: "235",
  },
  {
    id: 111,
    title: "141. Intersection Of 2 Link Lists",
    thumbnail:
      "https://i.postimg.cc/Y2gd05TR/DALL-E-2025-03-20-09-46-22-A-professional-futuristic-You-Tube-thumbnail-for-a-coding-tutorial-titl.jpg",
    url: "https://odysee.com/%24/embed/141.-Intersection-Of-2-Link-Lists%3Aa?r=GZutQyR5EPnTE4CHQtHu8guBxTKkaBRv",
    uploader: "Unknown",
    views: "5100",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.", // Description doesn't match URL
    platform: "Odysee", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "510",
    comments: "240",
  },
  {
    id: 112,
    title: "142. Merge Two Sorted Lists",
    thumbnail: "https://i.postimg.cc/TYtg3Q2Q/4291e875-8329-44e6-9a81-04e121ee8800.webp",
    url: "https://www.bitchute.com/embed/BYytCAHBh7S0/",
    uploader: "Unknown",
    views: "5200",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.", // Description doesn't match URL
    platform: "Bitchute", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "520",
    comments: "245",
  },
  {
    id: 113,
    title: "143. Sort List Using Merge Sort",
    thumbnail: "https://i.postimg.cc/hjMTQ0bS/o157wv8-Veds-V16-Ma-generated-image.jpg",
    url: "https://www.youtube.com/embed/Xmlzlrj3pHk?si=yvHeB2htBsRT8_4g",
    uploader: "Unknown",
    views: "5300",
    uploadDate: "1 day ago",
    description: "Another video on Rumble platform.", // Description doesn't match URL
    platform: "YouTube", // Corrected platform
    category: "Sorting Algorithms", // Corrected category (Merge Sort specific)
    likes: "530",
    comments: "250",
  },
  {
    id: 114,
    title: "144. Flatten Linked List",
    thumbnail: "https://i.postimg.cc/SRs86zDc/29e0cd3f-2d73-40c2-b146-ef832b66895d.webp",
    url: "https://fast.wistia.net/embed/iframe/jj78l6793b",
    uploader: "Preetam",
    views: "5400",
    uploadDate: "1 day ago",
    description: "Yet another video on Rumble platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "540",
    comments: "255",
  },
  {
    id: 115,
    title: "145. Copy List with Random Pointer",
    thumbnail: "https://i.postimg.cc/NM0LSvmc/c759ec99-21bd-4c3b-91b1-94d486d71609.webp",
    url: "https://fast.wistia.com/embed/84mfwcnlpt.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "5500",
    uploadDate: "1 day ago",
    description: "A video on Odysee platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "550",
    comments: "260",
  },
  {
    id: 116,
    title: "146. Rotate List",
    thumbnail: "https://i.postimg.cc/C5shxvjN/b29efcaf-a38e-4d0c-9b69-ba6bef5dff0d.webp",
    url: "https://fast.wistia.com/embed/fgn95u009c.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "5600",
    uploadDate: "1 day ago",
    description: "A video on BitChute platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "560",
    comments: "265",
  },
  {
    id: 117,
    title: "147. Delete N Nodes After M Nodes",
    thumbnail: "https://i.postimg.cc/YSYJ7vNN/1g-Xa-TROdq1-Kwr-G89-generated-image.jpg",
    url: "https://fast.wistia.com/embed/vg3laxi4mh.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "5700",
    uploadDate: "1 day ago",
    description: "Another video on YouTube platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "570",
    comments: "270",
  },
  {
    id: 118,
    title: "148. Find minmax number between critical points (LC-2058)",
    thumbnail: "https://i.postimg.cc/JhV2p1ws/7-Snccv-HRT3xo-Bb-PI-generated-image.jpg",
    url: "https://fast.wistia.com/embed/ot0ix26qig.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "5800",
    uploadDate: "1 day ago",
    description: "A video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "580",
    comments: "275",
  },
  {
    id: 119,
    title: "149. Merge Nodes In Between Zeros",
    thumbnail: "https://i.postimg.cc/Dz6P1F7k/76539hzflbbc0-Y24-generated-image.jpg",
    url: "https://fast.wistia.com/embed/mqbapm6wn5.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "5900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category
    likes: "590",
    comments: "280",
  },
  {
    id: 120,
    title: "150. Stack Class - 1 [HD]",
    thumbnail: "https://i.postimg.cc/MpjNKH2G/37h-IW08-Jkfv-JZ33-K-generated-image.jpg",
    url: "https://fast.wistia.com/embed/kp0mjivr8k.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "6000",
    uploadDate: "1 day ago",
    description: "Yet another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stacks", // Corrected category
    likes: "600",
    comments: "285",
  },
  {
    id: 121,
    title: "151. Stack Class - 2 [HD]",
    thumbnail: "https://i.postimg.cc/7L8cC4wn/13t8g-X0vd-JNdm-QEQ-generated-image.jpg",
    url: "https://fast.wistia.com/embed/id79vdq26y.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "6100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stacks", // Corrected category
    likes: "610",
    comments: "290",
  },
  {
    id: 1991, // Out of sequence ID from prompt
    title: "152. Stack Class - 3 and 4 [HD]",
    thumbnail: "https://i.postimg.cc/Bb6wWQB4/fynpc-O6q-YWe-Cq1-FT-generated-image.jpg",
    url: "https://archive.org/embed/152.-stack-class-3-and-4-hd", // URL domain is archive.org
    uploader: "Unknown",
    views: "6100", // Copied from previous entry as per original data
    uploadDate: "1 day ago", // Copied from previous entry as per original data
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Internet Archive", // Corrected platform
    category: "Stacks", // Corrected category
    likes: "610", // Copied from previous entry as per original data
    comments: "290", // Copied from previous entry as per original data
  },
  {
    id: 153,
    title: "153. Remove All Adjacent Strings",
    thumbnail: "https://i.postimg.cc/g0WSzKHM/zchf-QUf-GMq-U5g3s-E-generated-image.jpg",
    url: "https://www.youtube.com/embed/KHpezd6OU7w?si=opsGaOduua2NCL2L",
    uploader: "Unknown",
    views: "9300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "YouTube", // Corrected platform
    category: "String Algorithms", // Corrected category (Stack application)
    likes: "930",
    comments: "450",
  },
  {
    id: 154,
    title: "154. Minimum Bracket Reversal",
    thumbnail: "https://i.postimg.cc/GmhPqSzn/z-L0-Az2-Hpr-Yxs-Ynj-Z-generated-image.jpg",
    url: "https://fast.wistia.com/embed/wop8ak3pru.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "9400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stack Problems", // Corrected category
    likes: "940",
    comments: "455",
  },
  {
    id: 155,
    title: "155. Next Greater Element In L.L",
    thumbnail: "https://i.postimg.cc/FFVJ8VYr/o-Sj-Rme-Pk9-Mf1-DQGt-generated-image.jpg",
    url: "https://fast.wistia.com/embed/7ohwph3mtl.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "9500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Linked Lists", // Corrected category (Stack can be used, but topic is LL)
    likes: "950",
    comments: "460",
  },
  {
    id: 156,
    title: "156. Celebrity Problem",
    thumbnail: "https://i.postimg.cc/RFsQr10b/s-Nj-IZCe-BNj4u-FEs4-generated-image.jpg",
    url: "https://fast.wistia.com/embed/h3wnbs4cbx.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "9600",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Algorithm Problems", // Corrected category (Classic problem, often uses Stack)
    likes: "960",
    comments: "465",
  },
  {
    id: 157,
    title: "157. N Stacks In An Array",
    thumbnail: "https://i.postimg.cc/yxC9CfHj/C1-Fr-L660-Jqirn73j-generated-image.jpg",
    url: "https://fast.wistia.com/embed/vh1ysx82ho.js", // URL domain is wistia.com
    uploader: "Preetam Singh",
    views: "9700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stacks", // Corrected category
    likes: "970",
    comments: "470",
  },
  {
    id: 158,
    title: "158. Online Stock Span",
    thumbnail: "https://i.postimg.cc/D0RNh3zD/Sc-ROOqzz2k-O1-Vx-Dk-generated-image.jpg",
    url: "https://fast.wistia.com/embed/y4gd3pmizn.js", // URL domain is wistia.com
    uploader: "Preetam Singh",
    views: "9800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stack Problems", // Corrected category
    likes: "980",
    comments: "475",
  },
  {
    id: 159,
    title: "159. Simplify Path",
    thumbnail: "https://i.postimg.cc/Yq4pcQRG/0-Kee2u-XSOA2n38p-N-generated-image.jpg",
    url: "https://fast.wistia.com/embed/3gdwrmavh3.js", // URL domain is wistia.com
    uploader: "Unknown",
    views: "9900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stack Problems", // Corrected category
    likes: "990",
    comments: "480",
  },
  {
    id: 160,
    title: "160. Check If Word Is Valid After Substitutions",
    thumbnail: "https://i.postimg.cc/sgssMbyS/VVG7-Gc-X9dy-WKYGvc-generated-image.jpg",
    url: "https://fast.wistia.com/embed/8jjzeipmtq.js", // URL domain is wistia.com
    uploader: "Preetam Singh",
    views: "10000",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stack Problems", // Corrected category
    likes: "1000",
    comments: "485",
  },
  {
    id: 161,
    title: "161. Decode String",
    thumbnail: "https://i.postimg.cc/9fbChb72/O5s6h-Idr7zz-Mg1l4-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/qxy6d1dx7r", // URL domain is wistia.com
    uploader: "Unknown",
    views: "10100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.", // Description doesn't match URL
    platform: "Wistia", // Corrected platform
    category: "Stack Problems", // Corrected category
    likes: "1010",
    comments: "490",
  },
  {
    id: 162,
    title: "162. Max Rectangle In Binary Matrix",
    thumbnail: "https://i.postimg.cc/g2PwsYFT/wq-Pp-YWxcg5-MHVRcn-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/nbcx1o649e",
    uploader: "Unknown",
    views: "10100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1010",
    comments: "490",
  },
  {
    id: 163,
    title: "163. Car Fleet",
    thumbnail: "https://i.postimg.cc/CxQ1RDHk/Vsuz-Md-Btvpak-Ou-Wp-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/n9eu6aty5h",
    uploader: "Unknown",
    views: "10300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1030",
    comments: "500",
  },
  {
    id: 164,
    title: "164. Car Fleet-II",
    thumbnail: "https://i.postimg.cc/NFsYJfkQ/699xsn-MJJ4jw-DMn-I-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/r7xc9fsdm0",
    uploader: "Unknown",
    views: "10400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1040",
    comments: "505",
  },
  {
    id: 165,
    title: "165. Queue - Class 1 [HD]",
    thumbnail: "https://i.postimg.cc/tTwRTH3b/Milt-FJs-Bxq-FMz-Kuf-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/bnm9m3h19z",
    uploader: "Preetam Singh",
    views: "10500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1050",
    comments: "510",
  },
  {
    id: 166,
    title: "166. Queue - Class 2 [HD]",
    thumbnail: "https://i.postimg.cc/50vTBdcb/MJrp-Zz-Zc-AGcx-Vy64-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/bhqnvwzss6",
    uploader: "Preetam Singh",
    views: "10600",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1060",
    comments: "515",
  },
  {
    id: 167,
    title: "167. Queue - Class 3 [HD]",
    thumbnail: "https://i.postimg.cc/BQZ761vq/4-N19-Zog-Icw-DC0s-Rk-generated-image.jpg",
    url: "https://fast.wistia.com/embed/medias/yd9aytwzq1",
    uploader: "Preetam Singh",
    views: "10700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "wistia",
    category: "education",
    likes: "1070",
    comments: "520",
  },
  {
    id: 168,
    title: "169. Stacks Using Queue",
    thumbnail: "https://i.postimg.cc/0jtNsJVt/o-M3wfz-Ljns3sjahd-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "10800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1080",
    comments: "525",
  },
  {
    id: 169,
    title: "170. K Queues In An Array",
    thumbnail: "https://i.postimg.cc/hv85z9kr/Nhs-NSQm-RW2s-FITpr-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "10900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1090",
    comments: "530",
  },
  {
    id: 170,
    title: "171. Sum Of Min & Max Elements Of All Subarray Of Size K",
    thumbnail: "https://i.postimg.cc/KYMScg89/Le-HY6-Jkq-B3iq-MFfn-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11000",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1100",
    comments: "535",
  },
  {
    id: 171,
    title: "172. Trees Class - 1 [HD]",
    thumbnail: "https://i.postimg.cc/y6n5HTT1/Dm-Ar-Qf3doenib718-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1110",
    comments: "540",
  },
  {
    id: 172,
    title: "173. Trees Class - 2 [HD]",
    thumbnail: "https://i.postimg.cc/VNyZRZzR/JBQOSHGFe7-Xuaa-Yt-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11200",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1120",
    comments: "545",
  },
  {
    id: 173,
    title: "174. Trees Class - 3 [HD]",
    thumbnail: "https://i.postimg.cc/T32NH5by/4a-Ik-Kvee-S4-JZsp-MP-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1130",
    comments: "550",
  },
  {
    id: 174,
    title: "175. Trees Class - 4 [HD]",
    thumbnail: "https://i.postimg.cc/Mp0VC9yt/hjssnjx81-Bv-Xut-Wy-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1140",
    comments: "555",
  },
  {
    id: 175,
    title: "176. FW To Find Diameter",
    thumbnail: "https://i.postimg.cc/pdzC9thv/F8-SZbf9uy-Zee-Qs-Hs-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1150",
    comments: "560",
  },
  {
    id: 176,
    title: "177. FW To Find Height Balanced Tree",
    thumbnail: "https://i.postimg.cc/P59TM0XN/0-BT0pxgwm-K2r-IPw-N-generated-image.jpg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11600",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1160",
    comments: "565",
  },
  {
    id: 177,
    title: "178. Two Trees Mirror OR Identical",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1170",
    comments: "570",
  },
  {
    id: 178,
    title: "179. Diagonal Traversal",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1180",
    comments: "575",
  },
  {
    id: 179,
    title: "180. Zig-Zag Traversal",
    thumbnail: "https://i.postimg.cc/NjS4wVzp/Gen-2-1111065503-AQPIy-Lc-DWrm-BSL5-CEUTt-M-5-mp4.gif",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "11900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1190",
    comments: "580",
  },
  {
    id: 180,
    title: "181. Transform To Sum Tree",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12000",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1200",
    comments: "585",
  },
  {
    id: 181,
    title: "182. Vertical Order Traversal",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1210",
    comments: "590",
  },
  {
    id: 182,
    title: "183. K-Sum Paths",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://odysee.com/%24/embed/183.-K-Sum-Paths%3A9?r=GZutQyR5EPnTE4CHQtHu8guBxTKkaBRv&autoplay=true",
    uploader: "Preetam Singh",
    views: "12200",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1220",
    comments: "595",
  },
  {
    id: 183,
    title: "184. BST Class - 1 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1230",
    comments: "600",
  },
  {
    id: 184,
    title: "185. BST Class - 2 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1240",
    comments: "605",
  },
  {
    id: 185,
    title: "186. BST Class - 3 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1250",
    comments: "610",
  },
  {
    id: 186,
    title: "187. Heaps Class - 1 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12600",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1260",
    comments: "615",
  },
  {
    id: 187,
    title: "189. Heaps Class - 3 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1270",
    comments: "620",
  },
  {
    id: 188,
    title: "190. Heaps Class - 4 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "12800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1280",
    comments: "625",
  },
  {
    id: 189,
    title: "191. Hashmaps & Tries - Class 1 [HD]",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://archive.org/embed/191.-hashmaps-tries-class-1-hd",
    uploader: "Preetam Singh",
    views: "12900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1290",
    comments: "630",
  },
  {
    id: 190,
    title: "192. Hashmaps & Tries - Class 2 [HD]",
    thumbnail:
      "https://i.postimg.cc/s21sWwCZ/AQMuqj8k-XVu-USEw6-F6u-TSd0o-ZM-OM7av-XS47e6-C-GB5-YYe-XT-j-S5yu-VJFNZ8-L0-HEJI9-BF3o-Qh-Jo-Luxm6-Dgow-IPXBnxzy6d-FTjh.jpg",
    url: "hhttps://rutube.ru/play/embed/5691e340599e1cb718653dd6dbc8b564/?p=17spV_7Yk8HgkEsm5cgKMg&skinColor=9e9e9e",
    uploader: "Preetam Singh",
    views: "13000",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1300",
    comments: "635",
  },
  {
    id: 191,
    title: "193. Hashmaps & Tries - Class 3 [HD]",
    thumbnail: "https://i.postimg.cc/QM2JYyH7/Promotional-Graphic-Featuring-Enthusiastic-Gamer-With-Bold-Text.png",
    url: "https://rutube.ru/play/embed/a52bbe652203f1be550d0be7f3678886/?p=uePklkyFhE1Bam4K8a_Yyw&skinColor=d57700&t=10https://rutube.ru/play/embed/a52bbe652203f1be550d0be7f3678886/?p=uePklkyFhE1Bam4K8a_Yyw&skinColor=d57700&t=10https://rutube.ru/play/embed/a52bbe652203f1be550d0be7f3678886/?p=uePklkyFhE1Bam4K8a_Yyw&skinColor=d57700&t=10",
    uploader: "Preetam Singh",
    views: "13100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1310",
    comments: "640",
  },

  {
    id: 193,
    title: "194. Dynamic Programming 1 Class 1",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://rutube.ru/play/embed/4a7604edb944a6a84dafadb31330a675/?p=qLYeaWqs2kb5sncMoqbTGA",
    uploader: "Preetam Singh",
    views: "13300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1330",
    comments: "650",
  },
  {
    id: 194,
    title: "195. Dynamic Programming 1 Class 2",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "13400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1340",
    comments: "655",
  },
  {
    id: 195,
    title: "196. Dynamic Programming 1 Class 3",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://rutube.ru/play/embed/50a67aa2dee7f9c6978b34c551cb6f47/?p=rfOR--foFsjmmOforc2GeQ",
    uploader: "Preetam Singh",
    views: "13500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1350",
    comments: "660",
  },
  {
    id: 196,
    title: "197. Dynamic Programming 1 Class 4",
    thumbnail: "https://i.postimg.cc/VLH1hxc5/5fc42894-a681-4fcb-a6d4-b1cf33177fe8.png",
    url: "https://rutube.ru/play/embed/a16358dd47f8752de7a02890ee033ad6?skinColor=0e8dee&t=5",
    uploader: "Preetam Singh",
    views: "13600",
    uploadDate: "1 day ago",
    description: "Another video on Google Rutube platform.",
    platform: "Rutube",
    category: "education",
    likes: "1360",
    comments: "665",
  },
  {
    id: 197,
    title: "198. Dynamic Programming 2 Class 5",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "13700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1370",
    comments: "670",
  },
  {
    id: 198,
    title: "199. Dynamic Programming 2 Class 6",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "13800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1380",
    comments: "675",
  },
  {
    id: 199,
    title: "200. Dynamic Programming 2 Class 7",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://rutube.ru/play/embed/90ec19aa3c64d340aecc14304fea5233/?p=OgclGJSNN5vr7wz88BXMjw&skinColor=43a047&t=10",
    uploader: "Preetam Singh",
    views: "13900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1390",
    comments: "680",
  },

  {
    id: 201,
    title: "201. Graphs 1 Class 1",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1410",
    comments: "690",
  },
  {
    id: 202,
    title: "202. Graphs 1 Class 2",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14200",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1420",
    comments: "695",
  },
  {
    id: 203,
    title: "203. Graphs 1 Class 3",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1430",
    comments: "700",
  },
  {
    id: 204,
    title: "204. Graphs 1 Class 4",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14400",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1440",
    comments: "705",
  },
  {
    id: 205,
    title: "205. Graphs 2 Class 5",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14500",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1450",
    comments: "710",
  },
  {
    id: 206,
    title: "206. Graphs 2 Class 6",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14600",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1460",
    comments: "715",
  },
  {
    id: 207,
    title: "207. Graphs 2 Class 7",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14700",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1470",
    comments: "720",
  },
  {
    id: 208,
    title: "208. Graphs 2 Class 8",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "14800",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1480",
    comments: "725",
  },
  {
    id: 209,
    title: "209. Bonus Class - Greedy Algorithm",
    thumbnail: "https://i.postimg.cc/2SYXgwkL/Gen-2-3778139807-imagejpg-M-5-mp4.gif",
    url: "https://rutube.ru/play/embed/076b8c00e8dcf36b38bac0fb26916b77/?p=E62zTDkr2lqlTe5pp9-bWA",
    uploader: "Preetam Singh",
    views: "14900",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1490",
    comments: "730",
  },
  {
    id: 210,
    title: "210. Bonus Class - Bit Manipulation",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "15000",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1500",
    comments: "735",
  },
  {
    id: 211,
    title: "211. Interview - Do's and Don'ts",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://iframe.dacast.com/vod/6999c0d0-e8d6-a121-2f1d-3a23a644d6b5/196262ed-8fa4-4550-9cbe-435b8fa0f6a7",
    uploader: "Preetam Singh",
    views: "15100",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1510",
    comments: "740",
  },
  {
    id: 212,
    title: "212. Let's Talk about Resume",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://rutube.ru/play/embed/05ecc41d2cee60ee31428e545e65df7c/",
    uploader: "Preetam Singh",
    views: "15200",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1520",
    comments: "745",
  },
  {
    id: 213,
    title: "213. Let's talk about Placement Opportunities",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "15300",
    uploadDate: "1 day ago",
    description: "Another video on Google Drive platform.",
    platform: "googleDrive",
    category: "education",
    likes: "1530",
    comments: "750",
  },
  {
    id: 214,
    title: "214. Last Class",
    thumbnail: "https://drive.google.com/thumbnail?id=1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg",
    url: "https://drive.google.com/file/d/1-9DIJg2kE4HMY2Q8bsQT8IiyxwlaQreg/preview",
    uploader: "Preetam Singh",
    views: "15400",
    uploadDate: "1 day ago",
    description: "The final video in the series.",
    platform: "googleDrive",
    category: "education",
    likes: "1540",
    comments: "755",
  },
]
