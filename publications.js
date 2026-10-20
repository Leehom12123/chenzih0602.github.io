// 更新论文时编辑此文件。year 按期刊卷期年份填写，onlineYear 可记录首次上线年份。
// 缺失的卷、期、页码与 DOI 留空即可，页面会自动省略。
window.PUBLICATIONS = [
  {
    id: "chen2026switching", year: 2026,
    title: "Switching Learning for Multi-Player Optimal H∞ Cooperative Output Regulation in Stochastic Singularly Perturbed Multi-Agent Systems",
    bibTitle: "Switching Learning for Multi-Player Optimal {$H_{\\infty}$} Cooperative Output Regulation in Stochastic Singularly Perturbed Multi-Agent Systems",
    authors: ["Zihan Chen", "Dongdong Li", "Jiuxiang Dong"],
    journal: "Journal of the Franklin Institute", volume: "", number: "", pages: "", doi: "10.1016/j.jfranklin.2026.109162",
    url: "https://www.researchgate.net/publication/415848007_Switching_Learning_for_Multi-Player_Optimal_H_Cooperative_Output_Regulation_in_Stochastic_Singularly_Perturbed_Multi-Agent_Systems",
    tags: ["multiagent", "learning"], keywords: ["多智能体输出调节", "切换学习"],
    summary: "针对随机奇异摄动多智能体系统，研究多参与者最优输出调节，并结合价值迭代与策略迭代设计切换学习方法"
  },
  {
    id: "chen2026inverse", year: 2026,
    title: "Inverse Reinforcement Learning for Structured Fault-Tolerant Control in Nonlinear MASs Under Switching Topologies",
    bibTitle: "Inverse Reinforcement Learning for Structured Fault-Tolerant Control in Nonlinear {MASs} Under Switching Topologies",
    authors: ["Zihan Chen", "Dongdong Li", "Jiuxiang Dong"],
    journal: "IEEE Transactions on Automation Science and Engineering", volume: "23", number: "", pages: "11696--11708", doi: "10.1109/TASE.2026.3705242",
    url: "https://www.researchgate.net/publication/407216469_Inverse_Reinforcement_Learning_for_Structured_Fault-Tolerant_Control_in_Nonlinear_MASs_under_Switching_Topologies",
    tags: ["multiagent", "learning", "structured"], keywords: ["逆强化学习", "结构化容错控制"],
    summary: "研究切换通信拓扑下非线性多智能体系统的结构化容错控制，使反馈增益结构与通信拓扑相匹配，并通过逆策略迭代开展控制策略学习"
  },
  {
    id: "chen2026threephase", year: 2026,
    title: "Stabilizing Three-Phase Reinforcement Learning for Optimal Output Consensus in Stochastic Takagi-Sugeno Fuzzy Multi-Agent Systems",
    bibTitle: "Stabilizing Three-Phase Reinforcement Learning for Optimal Output Consensus in Stochastic {Takagi-Sugeno} Fuzzy Multi-Agent Systems",
    authors: ["Zihan Chen", "Dongdong Li", "Jiuxiang Dong"],
    journal: "Fuzzy Sets and Systems", volume: "542", number: "", pages: "109947", doi: "10.1016/j.fss.2026.109947",
    url: "https://www.researchgate.net/publication/405184877_Stabilizing_Three-Phase_Reinforcement_Learning_for_Optimal_Output_Consensus_in_Stochastic_Takagi-Sugeno_Fuzzy_Multi-Agent_Systems",
    tags: ["multiagent", "learning"], keywords: ["最优输出一致性", "稳定化学习"],
    summary: "面向离散时间随机模糊多智能体系统的最优输出一致性问题，设计三阶段稳定化强化学习算法，逐步获得稳定并满足性能目标的控制策略"
  },
  {
    id: "mei2026structure", year: 2026,
    title: "Data-based structure-constrained sliding mode control scheme for interconnected multi-machine power systems",
    authors: ["Sen Mei", "Zihan Chen", "Dongdong Li", "Jiuxiang Dong"],
    correspondingAuthor: "Zihan Chen",
    journal: "International Journal of Systems Science", volume: "", number: "", pages: "", doi: "10.1080/00207721.2026.2710895",
    url: "https://www.tandfonline.com/doi/full/10.1080/00207721.2026.2710895",
    tags: ["structured", "power"], keywords: ["电力系统", "结构约束", "滑模控制"],
    summary: "研究虚假数据注入攻击下互联多机电力系统的结构约束滑模控制，使反馈增益与可用通信结构相一致，并通过数据驱动方法计算控制策略"
  },
  {
    id: "tang2026sparse", year: 2026, onlineYear: 2025,
    title: "Reinforcement Learning-Based Stochastic Structurally-Sparse Sliding Mode Control for IT-2 T-S Fuzzy Interconnected Multi-Area Power System",
    bibTitle: "Reinforcement Learning-Based Stochastic Structurally-Sparse Sliding Mode Control for {IT-2 T-S} Fuzzy Interconnected Multi-Area Power System",
    authors: ["Shengda Tang", "Zihan Chen", "Hai Wang", "Jun Cheng"],
    journal: "Fuzzy Sets and Systems", volume: "526", number: "", pages: "109675", doi: "10.1016/j.fss.2025.109675",
    url: "https://www.researchgate.net/publication/397540397_Reinforcement_Learning-Based_Stochastic_Structurally-Sparse_Sliding_Mode_Control_for_IT-2_T-S_Fuzzy_Interconnected_Multi-Area_Power_System",
    tags: ["learning", "structured", "power"], keywords: ["电力系统", "结构化稀疏控制", "滑模控制"],
    summary: "围绕多区域互联电力系统，研究随机通信拓扑和攻击影响下的结构化稀疏滑模控制，并利用强化学习降低控制器设计对系统模型的依赖"
  },
  {
    id: "chen2025compression", year: 2025,
    title: "Data Compression-Based Model-Free PI Algorithm for Sparse LQT Control in Interconnected Multimachine Power Systems",
    bibTitle: "Data Compression-Based Model-Free {PI} Algorithm for Sparse {LQT} Control in Interconnected Multimachine Power Systems",
    authors: ["Zihan Chen", "Shengda Tang"],
    journal: "IEEE Systems Journal", volume: "19", number: "1", pages: "176--187", doi: "10.1109/JSYST.2025.3533880",
    url: "https://www.researchgate.net/publication/388978602_Data_Compression-Based_Model-Free_PI_Algorithm_for_Sparse_LQT_Control_in_Interconnected_Multimachine_Power_Systems",
    tags: ["learning", "structured", "power"], keywords: ["电力系统", "稀疏跟踪控制", "数据压缩"],
    summary: "针对互联多机电力系统的稀疏线性二次型跟踪控制，结合数据压缩与无模型策略迭代，设计满足实际通信结构约束的分布式控制器"
  }
];
