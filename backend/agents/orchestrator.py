from typing import TypedDict, Any, cast

try:
    from langgraph.graph import StateGraph, END
    HAS_LANGGRAPH = True
except Exception:
    HAS_LANGGRAPH = False
    StateGraph = None
    END = None

from backend.agents.research_agent import ResearchAgent
from backend.agents.screener_agent import ScreenerAgent
from backend.agents.coach_agent import CoachAgent
from backend.agents.analytics_agent import AnalyticsAgent

# ── State Schema ────────────────────────────────
class AgentState(TypedDict):
    resume_text: str
    job_role: str
    company: str
    research_result: dict
    screener_result: dict
    coach_result: dict
    analytics_result: dict

# ── Agent Nodes ─────────────────────────────────
def research_node(state: AgentState) -> AgentState:
    agent = ResearchAgent()
    result = agent.run(state["job_role"], state.get("company", ""))
    state["research_result"] = result
    return state

def screener_node(state: AgentState) -> AgentState:
    agent = ScreenerAgent()
    research_summary = ""
    if isinstance(state.get("research_result"), dict):
        research_summary = str(state["research_result"].get("research_summary", ""))

    result = agent.run(
        state["resume_text"],
        state["job_role"],
        research_summary
    )
    state["screener_result"] = result
    return state

def coach_node(state: AgentState) -> AgentState:
    agent = CoachAgent()
    missing_skills = []
    if isinstance(state.get("screener_result"), dict):
        missing_skills = state["screener_result"].get("missing_skills", [])

    result = agent.generate_questions(
        state["job_role"],
        missing_skills,
        state.get("resume_text", "")
    )
    state["coach_result"] = result
    return state

def analytics_node(state: AgentState) -> AgentState:
    agent = AnalyticsAgent()
    matched_skills = []
    missing_skills = []
    score = 0

    if isinstance(state.get("screener_result"), dict):
        matched_skills = state["screener_result"].get("matched_skills", [])
        missing_skills = state["screener_result"].get("missing_skills", [])
        score = state["screener_result"].get("score", 0)

    result = agent.run(
        state["job_role"],
        matched_skills,
        missing_skills,
        score
    )
    state["analytics_result"] = result
    return state

# ── Build LangGraph Pipeline ─────────────────────
def build_pipeline() -> Any:
    if not HAS_LANGGRAPH or StateGraph is None:
        return None

    try:
        graph = StateGraph(cast(Any, AgentState))

        graph.add_node("research", research_node)
        graph.add_node("screener", screener_node)
        graph.add_node("coach", coach_node)
        graph.add_node("analytics", analytics_node)

        graph.set_entry_point("research")
        graph.add_edge("research", "screener")
        graph.add_edge("screener", "coach")
        graph.add_edge("coach", "analytics")
        graph.add_edge("analytics", END)

        return graph.compile()
    except Exception:
        return None

def run_pipeline(resume_text: str, job_role: str, company: str = "") -> dict:
    initial_state: AgentState = {
        "resume_text": resume_text,
        "job_role": job_role,
        "company": company,
        "research_result": {},
        "screener_result": {},
        "coach_result": {},
        "analytics_result": {}
    }

    pipeline = build_pipeline()

    if pipeline is not None:
        try:
            final_state: dict = pipeline.invoke(initial_state)
            return {
                "research": final_state.get("research_result", {}),
                "screener": final_state.get("screener_result", {}),
                "coach": final_state.get("coach_result", {}),
                "analytics": final_state.get("analytics_result", {})
            }
        except Exception as e:
            print(f"[Orchestrator] LangGraph error, running sequential fallback: {e}")

    # Sequential node execution fallback
    state = research_node(initial_state)
    state = screener_node(state)
    state = coach_node(state)
    state = analytics_node(state)

    return {
        "research": state.get("research_result", {}),
        "screener": state.get("screener_result", {}),
        "coach": state.get("coach_result", {}),
        "analytics": state.get("analytics_result", {})
    }