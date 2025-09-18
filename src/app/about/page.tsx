import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Briefcase, Code, GraduationCap, User } from "lucide-react";
import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import { NavBar } from "@/components/ui/nav-bar";
import qamil from "@/public/qm.jpg";

// Icons
import { FaReact, FaPython, FaDocker, FaAws } from "react-icons/fa";
import { FaNodeJs, FaGithub } from "react-icons/fa6";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiFastapi,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiSupabase,
  SiKubernetes,
} from "react-icons/si";

export default function AboutMe() {
  return (
    <div className="dark bg-[#121212] min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <AuroraText
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            colors={[
              "#ffffff",
              "#d9ffed",
              "#b3ffdb",
              "#8cffca",
              "#66ffa8",
              "#40ff94",
            ]}
          >
            Qamil Mirza
          </AuroraText>
          <p className="mt-3 text-xl text-primaryText">
            Full Stack Developer & Machine Learning Researcher
          </p>
        </div>

        <Tabs defaultValue="bio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bio">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bio</span>
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="tech">
              <Code className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tech Stack</span>
            </TabsTrigger>
          </TabsList>

          {/* Bio Section */}
          <TabsContent value="bio" className="mt-6">
            <Card className="dark:bg-gray-800 border-gray-700 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative min-h-[400px]">
                  <Image
                    src={qamil.src || "/placeholder.svg"}
                    alt="Profile picture"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-bottom"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      <User className="mr-1 h-3 w-3" /> About Me
                    </div>
                    <h2 className="text-2xl font-bold">
                      I Like To Work On Hard Problems.
                    </h2>
                    <div className="space-y-4">
                      <p className="text-primaryText">
                        I'm a full-stack developer with a background in data
                        science and statistics for quantum chemistry and computational biology,
                        currently studying at UC Berkeley. I love building useful things at the
                        intersection of web development, machine learning, and computational biology.
                      </p>
                      <p className="text-primaryText">
                        I’m enthusiastic about using machine learning and deep learning to solve
                        meaningful problems in areas like computational biology and finance. Recent
                        projects include toxicity prediction models in PyTorch and reinforcement
                        learning for portfolio optimization and smarter decision making. I enjoy
                        asking clear questions, running clean experiments, and shipping results.
                      </p>
                      <p className="text-primaryText">
                        I thrive in collaborative teams where sharing ideas sparks better solutions.
                        When I’m not coding, I’m outdoors, diving into research, or tinkering with
                        new tools to stretch my skills and learn something new every day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education" className="mt-6">
            <Card className="dark:bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" /> Education
                </CardTitle>
                <CardDescription className="text-primaryText">
                  My academic background
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="dark:bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          B.A. Data Science & Statistics
                        </CardTitle>
                        <Badge>2023 - 2027</Badge>
                      </div>
                      <CardDescription className="text-primaryText">
                        University of California Berkeley
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-primaryText">
                      <p className="text-sm text-primaryText">
                        Specialized in applied math and modelling alongside
                        quantum chemistry and computational biology, GPA
                        3.97/4.0
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          AI / ML
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Applied Math
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Quantum Chemistry
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Computational Biology
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Computer Science
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">CAIE A-Levels</CardTitle>
                        <Badge>2021 - 2023</Badge>
                      </div>
                      <CardDescription>Kolej Yayasan UEM</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Completed Cambridge Assessment International Education
                        (CAIE) A-Levels with distinction: A* in Mathematics,
                        Physics, and Chemistry, and A in Further Mathematics.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Mathematics
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Further Mathematics
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Physics
                        </Badge>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-300"
                        >
                          Chemistry
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience" className="mt-6">
            <Card className="dark:bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Work Experience
                </CardTitle>
                <CardDescription className="text-primaryText">
                  My professional journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-primary/20 pl-6">
                  {/* Job 1 */}
                  <div className="mb-10 relative">
                    <div className="absolute -left-[45px] -top-[5px] h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">
                        Machine Learning Research Assistant
                      </h3>
                      <Badge className="mt-2 sm:mt-0 w-fit">
                        Jan 2025 - Present
                      </Badge>
                    </div>
                    <p className="text-lg text-primaryText mb-2">Merck</p>
                    <ul className="list-disc pl-5 text-primaryText mb-3 space-y-1">
                      <li>
                        Developed Directed Message Passing Neural Networks
                        (D-MPNNs) for drug potency prediction (IC50/EC50) using
                        protein-ligand interactions
                      </li>
                      <li>
                        Optimized bash scripts for high-performance computing
                        (HPC), enabling parallel protein-ligand docking for
                        15.5k ligands
                      </li>
                      <li>
                        Conducted molecular docking with AutoDock Vina, refining
                        docking parameters to enhance structure-based drug
                        design
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        High-Performance Computing
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Bash Scripting
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Molecular Docking
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Graph Neural Networks
                      </Badge>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="mb-10 relative">
                    <div className="absolute -left-[45px] -top-[5px] h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">
                        Full Stack Software Engineer Intern
                      </h3>
                      <Badge className="mt-2 sm:mt-0 w-fit">
                        May 2024 - August 2024
                      </Badge>
                    </div>
                    <p className="text-lg text-primaryText mb-2">Supa</p>
                    <ul className="list-disc pl-5 text-primaryText mb-3 space-y-1">
                      <li>
                        Developed and deployed an onboarding app on AWS Elastic
                        Container Service integrated with PostgreSQL and a
                        Node.js and Express.js REST API, streamlining workflows
                        for 100+ annotators.
                      </li>
                      <li>
                        Developed a skill-based tagging system for user
                        categorization and added markdown support to enhance the
                        RAG pipeline, benefiting 500+ users.
                      </li>
                      <li>
                        Engineered an embedding visualization tool for 1M+ data
                        points that can be run in the browser using Python and
                        Plotly
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        AWS Elastic Container Service
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        PostgreSQL
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Node.js
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Express.js
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        React
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Retrieval Augmented Generation
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        WebGL
                      </Badge>
                    </div>
                  </div>

                  {/* Job 3 */}
                  <div className="relative">
                    <div className="absolute -left-[45px] -top-[5px] h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">Data Science Intern</h3>
                      <Badge className="mt-2 sm:mt-0 w-fit">
                        April 2021 - June 2021
                      </Badge>
                    </div>
                    <p className="text-lg text-primaryText mb-2">
                      Study Hub Asia
                    </p>
                    <ul className="list-disc pl-5 text-primaryText mb-3 space-y-1">
                      <li>
                        Engineered a robust data pipeline using Python and SQL
                        to standardize child abuse reporting across 13 states,
                        increasing data accuracy by 25%.
                      </li>
                      <li>
                        Designed Figma prototypes and an interactive pitch deck
                        to visualize project goals, securing financial and
                        technical backing from three key stakeholders
                      </li>
                      <li>
                        Scraped and structured a dataset of 1,000+ childcare
                        centers using Python and BeautifulSoup, creating a
                        user-friendly searchable database for reporting
                        insights.
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Python
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        SQLAlchemy
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        BeautifulSoup
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Selenium
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Figma Prototyping
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Deck Design
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tech Stack Section */}
          <TabsContent value="tech" className="mt-6">
            <Card className="dark:bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" /> Tech Stack
                </CardTitle>
                <CardDescription className="text-primaryText">
                  Technologies I work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Frontend */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Frontend</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <FaReact size={30} color="#61DBFB" strokeWidth={5} />
                        </div>
                        <div>
                          <p className="font-medium">React</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiTypescript size={20} color="#007ACC" />
                        </div>
                        <div>
                          <p className="font-medium">TypeScript</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiNextdotjs size={30} color="#000000" />
                        </div>
                        <div>
                          <p className="font-medium">Next.js</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiTailwindcss size={30} color="#06B6D4" />
                        </div>
                        <div>
                          <p className="font-medium">Tailwind</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Backend */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Backend</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText/10">
                          <FaNodeJs size={30} color="#00FF00" />
                        </div>
                        <div>
                          <p className="font-medium">Node.js</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiExpress size={30} color="#000000" strokeWidth={0.5} />
                        </div>
                        <div>
                          <p className="font-medium">Express</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <FaPython size={30} color="#3776AB" />
                        </div>
                        <div>
                          <p className="font-medium">Python</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiFastapi size={30} color="#009688" />
                        </div>
                        <div>
                          <p className="font-medium">FastAPI</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Database */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Database</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText/10">
                          <SiMongodb size={30} color="#00ED64" />
                        </div>
                        <div>
                          <p className="font-medium">MongoDB</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <SiPostgresql size={25} color="#ffffff" strokeWidth={0.6} />
                        </div>
                        <div>
                          <p className="font-medium">PostgreSQL</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiRedis size={30} color="#D82C20" />
                        </div>
                        <div>
                          <p className="font-medium">Redis</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText/10">
                          <SiSupabase size={30} color="#3ECF8E" />
                        </div>
                        <div>
                          <p className="font-medium">Supabase</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DevOps & Tools */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">
                      DevOps & Tools
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <FaDocker size={30} color="#2496ED" />
                        </div>
                        <div>
                          <p className="font-medium">Docker</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText/10">
                          <FaAws size={30} color="#FF9900" />
                        </div>
                        <div>
                          <p className="font-medium">AWS</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <FaGithub size={30} color="#181717" />
                        </div>
                        <div>
                          <p className="font-medium">Git</p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg border border-gray-700 p-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primaryText">
                          <SiKubernetes size={30} color="#326CE5" />
                        </div>
                        <div>
                          <p className="font-medium">Kubernetes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
