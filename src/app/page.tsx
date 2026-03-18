"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Eye,
  MessageSquare,
  Zap,
  Shield,
  Layers,
  ChevronDown,
  Bot,
  Cpu,
  Braces,
  Monitor,
  GitBranch,
  Globe,
} from "lucide-react";

function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  gradient: string;
  delay: number;
}) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group relative p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm hover:border-[var(--border-hover)] transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${gradient} opacity-20`}
          />
        </div>
        <div
          className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="relative text-[16px] font-bold text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="relative text-[13px] text-[var(--text-secondary)] leading-relaxed">
          {desc}
        </p>
      </motion.div>
    </RevealOnScroll>
  );
}

function StepCard({
  num,
  title,
  desc,
  icon: Icon,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <RevealOnScroll delay={delay} className="relative">
      <div className="flex items-start gap-5">
        <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-[16px] font-bold shadow-lg shadow-violet-500/20">
          {num}
        </div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-[var(--accent-light)]" />
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
              {title}
            </h3>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="landing-page min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-default)]"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
            >
              <Sparkles className="w-[18px] h-[18px] text-white" />
            </motion.div>
            <span className="text-[16px] font-bold tracking-tight text-gradient">
              FastCompanyAI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden sm:block text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5"
            >
              功能特性
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:block text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5"
            >
              工作原理
            </a>
            <Link href="/workspace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-[13px] font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
              >
                开始使用
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-radial from-violet-600/8 via-blue-500/5 to-transparent blur-3xl" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-4xl mx-auto px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-hover)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              AI 驱动的下一代代码生成平台
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            <span className="text-[var(--text-primary)]">用自然语言</span>
            <br />
            <span className="text-gradient">构建你的应用</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[17px] sm:text-[19px] text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            只需描述你想要什么，AI 将自动生成完整的可运行代码，
            <br className="hidden sm:block" />
            并在浏览器中实时预览效果
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/workspace">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-[15px] font-semibold shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 flex items-center gap-2.5 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="w-[18px] h-[18px] relative" />
                <span className="relative">开始试用</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.03 }}
              className="px-7 py-3.5 rounded-2xl border border-[var(--border-hover)] text-[var(--text-secondary)] text-[14px] font-medium hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all duration-300 flex items-center gap-2"
            >
              了解更多
              <ChevronDown className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-[var(--border-hover)] overflow-hidden bg-[var(--bg-secondary)]/80 backdrop-blur-md shadow-2xl shadow-black/30">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)]/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-0.5 rounded-md bg-[var(--bg-primary)]/80 text-[11px] text-[var(--text-quaternary)] font-mono">
                    localhost:3000/workspace
                  </div>
                </div>
              </div>
              <div className="flex h-[340px]">
                <div className="w-[200px] border-r border-[var(--border-default)] p-4 hidden sm:block">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-gradient">
                      FastCompanyAI
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="px-3 py-2 rounded-lg bg-[var(--bg-hover)] text-[10px] text-[var(--text-secondary)]">
                      帮我做一个 Todo 应用...
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600/5 to-blue-500/5 border border-violet-500/10 text-[10px] text-[var(--text-secondary)]">
                      已为你生成 Todo 应用，包含添加、删除、完成功能...
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] leading-[1.8]">
                  <div className="text-violet-400/70">
                    {"import"}{" "}
                    <span className="text-cyan-400/70">React</span> {"from"}{" "}
                    <span className="text-green-400/70">{'"react"'}</span>;
                  </div>
                  <div className="text-violet-400/70">
                    {"import"} {"{"}{" "}
                    <span className="text-cyan-400/70">useState</span> {"}"}{" "}
                    {"from"}{" "}
                    <span className="text-green-400/70">{'"react"'}</span>;
                  </div>
                  <div className="mt-2 text-[var(--text-quaternary)]">
                    {"// AI generated Todo App"}
                  </div>
                  <div className="text-violet-400/70">
                    {"export default function"}{" "}
                    <span className="text-yellow-400/70">TodoApp</span>
                    {"() {"}
                  </div>
                  <div className="text-[var(--text-tertiary)] pl-4">
                    {"const [todos, setTodos] = useState([]);"}
                  </div>
                  <div className="text-[var(--text-tertiary)] pl-4">
                    {"const [input, setInput] = useState('');"}
                  </div>
                  <div className="mt-1 text-[var(--text-tertiary)] pl-4 flex items-center gap-2">
                    <span>{"return ("}</span>
                    <span className="inline-block w-16 h-2 rounded bg-violet-500/20 animate-pulse" />
                  </div>
                </div>
                <div className="w-[220px] border-l border-[var(--border-default)] p-4 hidden md:flex flex-col items-center justify-center gap-3 bg-[var(--bg-tertiary)]/50">
                  <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                  <span className="text-[10px] text-[var(--text-quaternary)]">
                    实时预览
                  </span>
                  <div className="w-full space-y-2">
                    <div className="h-5 rounded bg-[var(--bg-hover)]" />
                    <div className="h-8 rounded bg-violet-500/10 border border-violet-500/10" />
                    <div className="h-3 rounded bg-[var(--bg-hover)] w-3/4" />
                    <div className="h-3 rounded bg-[var(--bg-hover)] w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[var(--text-quaternary)]"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm mb-6">
              <Zap className="w-3.5 h-3.5 text-[var(--accent-light)]" />
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                核心功能
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              <span className="text-gradient">强大能力</span>
              <span className="text-[var(--text-primary)]">，触手可及</span>
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] max-w-xl mx-auto">
              从对话到产品，一步到位的 AI 全栈代码生成体验
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={MessageSquare}
              title="自然语言驱动"
              desc="无需编程经验，用中文描述你的需求，AI 即刻理解并开始生成代码"
              gradient="from-violet-600 to-violet-400"
              delay={0}
            />
            <FeatureCard
              icon={Code2}
              title="实时代码生成"
              desc="AI 流式输出代码，文件逐行呈现在编辑器中，实时查看生成过程"
              gradient="from-blue-600 to-blue-400"
              delay={0.1}
            />
            <FeatureCard
              icon={Eye}
              title="即时预览"
              desc="代码生成完成后，浏览器内沙盒自动渲染，无需手动部署即可看到效果"
              gradient="from-cyan-600 to-cyan-400"
              delay={0.2}
            />
            <FeatureCard
              icon={Layers}
              title="多模型支持"
              desc="支持 GPT-4o、Gemini、Claude、DeepSeek 等主流大模型，自由切换"
              gradient="from-pink-600 to-pink-400"
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="密钥安全加密"
              desc="API Key 使用 AES-Fernet 加密存储，绝不明文保存，保障你的数据安全"
              gradient="from-emerald-600 to-emerald-400"
              delay={0.2}
            />
            <FeatureCard
              icon={GitBranch}
              title="全栈项目结构"
              desc="AI 自动生成完整的项目文件树，包含组件、样式、工具函数等"
              gradient="from-orange-600 to-orange-400"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-radial from-blue-500/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          <RevealOnScroll className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm mb-6">
              <Cpu className="w-3.5 h-3.5 text-[var(--accent-light)]" />
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                工作原理
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              <span className="text-[var(--text-primary)]">三步完成，</span>
              <span className="text-gradient">如此简单</span>
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              从想法到可运行应用，只需要三个简单步骤
            </p>
          </RevealOnScroll>

          <div className="space-y-12 relative">
            <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-violet-500/30 via-blue-500/20 to-transparent hidden sm:block" />
            <StepCard
              num="1"
              icon={Bot}
              title="配置你的 AI 模型"
              desc="选择你偏好的大语言模型（GPT-4o、Gemini Pro、Claude 等），填入 API Key，一键保存。支持自定义 Base URL 适配私有部署。"
              delay={0}
            />
            <StepCard
              num="2"
              icon={Braces}
              title="用自然语言描述需求"
              desc='在聊天框中输入你想要的应用，例如"帮我做一个带拖拽排序的 Todo 应用"。AI 会理解你的意图并开始生成代码。'
              delay={0.1}
            />
            <StepCard
              num="3"
              icon={Monitor}
              title="实时查看并编辑"
              desc="AI 流式输出的代码实时显示在编辑器中，文件结构自动构建。生成完成后沙盒自动渲染预览，你也可以手动编辑微调。"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              <span className="text-[var(--text-secondary)]">技术栈</span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Next.js", icon: Globe },
                { name: "FastAPI", icon: Zap },
                { name: "GPT-4o", icon: Bot },
                { name: "Gemini", icon: Sparkles },
                { name: "Claude", icon: MessageSquare },
                { name: "Monaco Editor", icon: Code2 },
                { name: "Sandpack", icon: Monitor },
                { name: "LiteLLM", icon: Layers },
              ].map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all cursor-default"
                >
                  <tech.icon className="w-4 h-4 text-[var(--accent-light)]" />
                  {tech.name}
                </motion.div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-radial from-violet-600/8 via-blue-500/5 to-transparent blur-3xl" />
        </div>

        <RevealOnScroll className="max-w-2xl mx-auto text-center relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 border border-violet-500/10 flex items-center justify-center"
          >
            <Sparkles className="w-9 h-9 text-[var(--accent-light)]" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            <span className="text-[var(--text-primary)]">准备好了吗？</span>
          </h2>
          <p className="text-[16px] text-[var(--text-secondary)] mb-10 leading-relaxed">
            告别繁琐的手写代码，让 AI 成为你的编程助手
            <br />
            现在就开始体验下一代开发方式
          </p>

          <Link href="/workspace">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-[16px] font-bold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="w-5 h-5 relative" />
              <span className="relative">立即开始试用</span>
              <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13px] font-bold text-gradient">
              FastCompanyAI
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-quaternary)]">
            AI-Powered Code Generation Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
